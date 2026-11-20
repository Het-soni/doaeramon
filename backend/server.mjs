import {account} from "./accounts.mjs";
import http from "node:http";
import {resolve, extname, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {createReadStream} from "node:fs";
import {stat, realpath} from "node:fs/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
const visitors = new Map();
const clients = new Set(), messages = [], recent = new Map();
const allowed = new Set((process.env.SITE_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean));
const mime = {".html":"text/html",".css":"text/css",".js":"text/javascript",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".svg":"image/svg+xml",".mp3":"audio/mpeg",".mp4":"video/mp4",".ico":"image/x-icon",".xml":"application/xml",".txt":"text/plain"};
const snapshot = () => "data: " + JSON.stringify({online:clients.size, messages}) + "\n\n";
function broadcast() { const data = snapshot(); for (const c of clients) c.write(data); }

const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    if (pathname.startsWith("/chat/") || pathname.startsWith("/account/")) {
      const origin = req.headers.origin;
      if (origin && !(allowed.has(origin) || ["http://","https://"].some(p => origin === p + req.headers.host))) {
        res.writeHead(403).end(); return;
      }
      if (origin) res.setHeader("Access-Control-Allow-Origin",origin);
      res.setHeader("Vary","Origin");
      res.setHeader("Access-Control-Allow-Credentials","true");
      res.setHeader("Cache-Control","no-store");
      if (req.method === "OPTIONS") {
        res.writeHead(204,{"Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"}).end(); return;
      }
      if(pathname.startsWith("/account/")) {await account(req,res,pathname);return;}
      if(req.method==="GET" && pathname==="/chat/snapshot"){
        const id=new URL(req.url,"http://localhost").searchParams.get("visitor");
        if(!/^[0-9a-f-]{36}$/.test(id||"")){res.writeHead(400).end();return;}
        const now=Date.now();for(const [key,last] of visitors)if(now-last>45000)visitors.delete(key);
        visitors.set(id,now);res.writeHead(200,{"Content-Type":"application/json"}).end(JSON.stringify({online:visitors.size,messages}));return;
      }
      if (req.method === "GET" && pathname === "/chat/events") {
        if (clients.size >= 250) { res.writeHead(503).end(); return; }
        res.writeHead(200,{"Content-Type":"text/event-stream","X-Accel-Buffering":"no"});
        clients.add(res); broadcast();
        const pulse = setInterval(() => res.write(": heartbeat\n\n"),20000);
        res.on("close",() => {clearInterval(pulse); clients.delete(res); broadcast();});
        return;
      }
      if (req.method === "POST" && pathname === "/chat/messages") {
        if (!req.headers["content-type"]?.startsWith("application/json")) {res.writeHead(415).end();return;}
        let body = "";
        for await (const part of req) { body += part.toString("latin1"); if(body.length > 4096){res.writeHead(413).end();return;} }
        const input = JSON.parse(Buffer.from(body,"latin1").toString());
        const name = typeof input?.name === "string" && input.name.trim();
        const text = typeof input?.text === "string" && input.text.trim();
        if (!name || !text || name.length>24 || text.length>350){res.writeHead(400).end();return;}
        const key = req.socket.remoteAddress + "/" + name.toLowerCase(), now = Date.now();
        for (const [k,t] of recent) if(now-t>=1500) recent.delete(k);
        if (recent.has(key)){res.writeHead(429).end();return;}
        recent.set(key,now); messages.push({name,text}); if(messages.length>60) messages.shift();
        broadcast(); res.writeHead(201).end(); return;
      }
      res.writeHead(404).end(); return;
    }
    if (!["GET","HEAD"].includes(req.method)){res.writeHead(405).end();return;}
    const path = pathname === "/" ? "/index.html" : pathname;
    if (!/^\/(?:[\w.-]+\.(?:html|txt|xml|js)|(?:assets|episode-details|css|js)\/.+)$/.test(path)
        || path.split(/[\\/]/).some(p=>p.startsWith("."))) {res.writeHead(404).end();return;}
    const file = await realpath(resolve(root,"."+path));
    if(!file.startsWith(resolve(root)+sep)){res.writeHead(404).end();return;}
    const info = await stat(file);
    if(!info.isFile()){res.writeHead(404).end();return;}
    const headers = {"Content-Type":mime[extname(file).toLowerCase()] || "application/octet-stream",
      "Accept-Ranges":"bytes","Content-Length":info.size};
    let start = 0, end = info.size - 1, status = 200;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (match && (match[1] || match[2])) {
        start = match[1] ? Number(match[1]) : Math.max(0, info.size-Number(match[2]));
        end = match[1] && match[2] ? Math.min(end,Number(match[2])) : end;
      } else start = info.size;
      if(start>end || start>=info.size){res.writeHead(416,{"Content-Range":"bytes */"+info.size}).end();return;}
      headers["Content-Range"] = `bytes ${start}-${end}/${info.size}`;
      headers["Content-Length"] = end-start+1;
      status=206;
    }
    res.writeHead(status,headers);
    if(req.method==="HEAD" || !info.size)res.end();
    else createReadStream(file,{start,end}).on("error",()=>res.destroy()).pipe(res);
  } catch(e) {if(!res.headersSent)res.writeHead(e instanceof SyntaxError || e instanceof URIError ? 400 : 404);res.end();}
});
server.listen(Number(process.env.PORT || 3000),"0.0.0.0");
