import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
const hash = value => createHash("sha256").update(value).digest("hex");
const prefix = "doraemon:" + (process.env.VERCEL_ENV || "development") + ":";
const ttl = 7 * 24 * 3600;

async function redis(commands) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw Error("storage");
  const response = await fetch(url.replace(/\/$/, "") + "/multi-exec", {
    method:"POST", headers:{Authorization:"Bearer " + token, "Content-Type":"application/json"},
    body:JSON.stringify(commands), signal:AbortSignal.timeout(8000)
  });
  if (!response.ok) throw Error("storage");
  const results = await response.json();
  if (!Array.isArray(results) || results.length !== commands.length || results.some(row => row.error)) throw Error("storage");
  return results.map(row => row.result);
}

export default async function handler(req,res) {
  res.setHeader("Cache-Control","private, no-store");
  const reply = (status,data) => res.status(status).json(data);
  const {scope,action} = req.query;
  const post = req.method === "POST";
  const get = req.method === "GET";
  if (post && (!req.headers["content-type"]?.startsWith("application/json") ||
      (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host))) {
    return reply(403,{error:"Use the form on this website."});
  }
  const ip = String(req.headers["x-vercel-forwarded-for"] || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0];
  const rateKey = prefix+"limit:"+hash(ip);
  try {
    let body = req.body || {};
    if (post && typeof body === "string") {
      try { body=JSON.parse(body); } catch {return reply(400,{error:"Invalid form."});}
    }
    if (scope==="account") {
      const session=(req.headers.cookie || "").match(/(?:^|;\s*)dw_session=([0-9a-f]{64})(?:;|$)/)?.[1];
      const sessionKey = prefix+"session:"+hash(session || "");
      const cookie = (value,age) => res.setHeader("Set-Cookie",`dw_session=${value}; Path=/account; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`);
      if (get && action==="me") {
        const email=session ? (await redis([["GET",sessionKey]]))[0] : null;
        return reply(200,{email});
      }
      if (post && action==="logout") {
        if(session) await redis([["DEL",sessionKey]]);
        cookie("",0);return reply(200,{email:null});
      }
      if (!post || !["login","signup"].includes(action)) return reply(404,{error:"Unknown action."});
      const email=String(body?.email || "").trim().toLowerCase(), pass=body?.password;
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||typeof pass!=="string"||pass.length<8||pass.length>128)
        return reply(400,{error:"Enter an email and an 8–128 character password."});
      const rate=rateKey+":auth:"+Math.floor(Date.now()/60000);
      const [attempts]=await redis([["INCR",rate],["EXPIRE",rate,120]]);
      if(attempts>25) return reply(429,{error:"Try again in a minute."});
      const user=prefix+"user:"+hash(email);
      if(action==="signup") {
        const salt=randomBytes(16).toString("hex"), key=await derive(pass,salt,64);
        const [created]=await redis([["SET",user,JSON.stringify({salt,hash:key.toString("hex")}),"NX"]]);
        if(!created)return reply(409,{error:"Account already exists. Please sign in."});
      } else {
        const [stored]=await redis([["GET",user]]);
        const record=stored ? JSON.parse(stored) : null;
        const key=await derive(pass,record?.salt || "missing-user-salt",64);
        if(!record || !timingSafeEqual(key,Buffer.from(record.hash,"hex")))return reply(401,{error:"Email or password is incorrect."});
      }
      const next=randomBytes(32).toString("hex");
      const commands=[["SET",prefix+"session:"+hash(next),email,"EX",ttl]];
      if(session)commands.push(["DEL",sessionKey]);
      await redis(commands);cookie(next,ttl);return reply(200,{email});
    }
    if(scope==="chat") {
      const room=prefix+"messages", presence=prefix+"online";
      if(get && action==="snapshot"){
        const visitor=req.query.visitor;
        if(typeof visitor!=="string" || !/^[0-9a-f-]{36}$/.test(visitor))return reply(400,{error:"Invalid visitor."});
        const now=Date.now();
        const [,,,online,messages]=await redis([["ZREMRANGEBYSCORE",presence,"-inf",now-45000],
          ["ZADD",presence,now,visitor],["EXPIRE",presence,90],["ZCARD",presence],["LRANGE",room,0,-1]]);
        return reply(200,{online,messages:messages.map(JSON.parse)});
      }
      if(post && action==="messages"){
        const name=typeof body?.name==="string" && body.name.trim(),text=typeof body?.text==="string" && body.text.trim();
        if(!name||!text||name.length>24||text.length>350)return reply(400,{error:"Check your nickname and message."});
        const [ready]=await redis([["SET",rateKey+":chat","1","NX","PX",1500]]);
        if(!ready)return reply(429,{error:"Please wait before sending again."});
        await redis([["RPUSH",room,JSON.stringify({name,text})],["LTRIM",room,-60,-1]]);
        return reply(201,{ok:true});
      }
    }
    return reply(404,{error:"Unknown action."});
  } catch {
    return reply(503,{error:"Database unavailable. Check the project's Upstash Redis connection."});
  }
}
