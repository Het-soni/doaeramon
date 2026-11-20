import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
const derive = promisify(scrypt);
const dir = process.env.DW_ACCOUNT_DIR || join(homedir(), ".doraemon-world");
mkdirSync(dir, {recursive:true,mode:0o700});
const db = new DatabaseSync(join(dir,"accounts.sqlite"));
db.exec(`PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS users(email TEXT PRIMARY KEY, salt TEXT NOT NULL, hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, email TEXT NOT NULL, expires INTEGER NOT NULL);`);
const attempts = new Map();
const digest = value => createHash("sha256").update(value).digest("hex");

export async function account(req,res,path) {
  const reply=(status,value)=>res.writeHead(status,{"Content-Type":"application/json"}).end(JSON.stringify(value));
  const token = (req.headers.cookie || "").match(/(?:^|;\s*)dw_session=([a-f0-9]{64})(?:;|$)/)?.[1] || "";
  const secure = req.socket.encrypted || req.headers["x-forwarded-proto"]?.split(",")[0].trim()==="https";
  const cookie = (value,seconds)=>res.setHeader("Set-Cookie",`dw_session=${value}; Path=/account; HttpOnly; Max-Age=${seconds}; ${secure?"SameSite=None; Secure":"SameSite=Lax"}`);
  if(path==="/account/me" && req.method==="GET"){
    const row=db.prepare("SELECT email FROM sessions WHERE token=? AND expires>?").get(digest(token),Date.now());
    return reply(200,{email:row?.email || null});
  }
  if(req.method!=="POST" || !req.headers["content-type"]?.startsWith("application/json"))return reply(400,{error:"Invalid request."});
  if(path==="/account/logout"){
    db.prepare("DELETE FROM sessions WHERE token=?").run(digest(token));cookie("",0);return reply(200,{email:null});
  }
  if(!["/account/signup","/account/login"].includes(path))return reply(404,{error:"Unknown action."});
  const ip=req.socket.remoteAddress, now=Date.now();
  for(const [key,item] of attempts)if(item.until<now)attempts.delete(key);
  const entry=attempts.get(ip)||{n:0,until:now+60000};attempts.set(ip,entry);
  if(++entry.n>25)return reply(429,{error:"Please try again in a minute."});
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>2048)return reply(413,{error:"Form is too large."});chunks.push(chunk);}
  let data;try{data=JSON.parse(Buffer.concat(chunks))}catch{return reply(400,{error:"Invalid form."});}
  const email=String(data?.email||"").trim().toLowerCase(),password=data?.password;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||typeof password!=="string"||password.length<8||password.length>128)return reply(400,{error:"Enter an email and an 8–128 character password."});
  if(path.endsWith("signup")){
    const salt=randomBytes(16).toString("hex"),hash=await derive(password,salt,64);
    const result=db.prepare("INSERT OR IGNORE INTO users VALUES(?,?,?)").run(email,salt,hash.toString("hex"));
    if(!result.changes)return reply(409,{error:"Account already exists. Please sign in."});
  }else{
    const row=db.prepare("SELECT salt,hash FROM users WHERE email=?").get(email);
    const hash=await derive(password,row?.salt || "unused-salt-for-missing-user",64);
    if(!row || !timingSafeEqual(hash,Buffer.from(row.hash,"hex")))return reply(401,{error:"Email or password is incorrect."});
  }
  const key=randomBytes(32).toString("hex");
  db.prepare("DELETE FROM sessions WHERE expires<=? OR token=?").run(now,digest(token));
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(digest(key),email,now+604800000);
  cookie(key,604800);return reply(200,{email});
}
