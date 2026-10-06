const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),envPath=path.join(__dirname,'.env');
if(fs.existsSync(envPath))for(const line of fs.readFileSync(envPath,'utf8').split(/\r?\n/)){const match=line.match(/^([A-Z_]+)=(.*)$/);if(match&&!process.env[match[1]])process.env[match[1]]=match[2].trim();}
const methods=new Set(['generateQuestion','evaluateAnswer','getHint','simplify','askFalak']);
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;
 if(origin&&['http://127.0.0.1:5500','http://localhost:5500'].includes(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');}
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/ai/')){
   const method=url.pathname.split('/').pop();if(req.method!=='POST'||!methods.has(method))return json(res,404,{error:'Unknown operation'});
   if(!process.env.AI_API_BASE_URL)return json(res,503,{error:'AI_API_BASE_URL is not configured in server/.env'});
   try{
     let body='';for await(const chunk of req){body+=chunk;if(body.length>100000)throw Error('Request too large');}
     JSON.parse(body);
     const headers={'Content-Type':'application/json'};if(process.env.AI_API_KEY)headers.Authorization=`Bearer ${process.env.AI_API_KEY}`;
     const upstream=await fetch(`${process.env.AI_API_BASE_URL.replace(/\/$/,'')}/${method}`,{method:'POST',headers,body,signal:AbortSignal.timeout(9000)});
     if(!upstream.ok)return json(res,502,{error:'AI provider request failed'});
     return json(res,200,await upstream.json());
   }catch{return json(res,502,{error:'AI request failed or timed out'});}
 }
 if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
 let relative;try{relative=decodeURIComponent(url.pathname);}catch{return json(res,400,{error:'Invalid path'});}
 const file=path.resolve(root,'.'+(relative==='/'?'/Main.html':relative));
 if(!file.startsWith(root+path.sep)||relative.split('/').some(p=>p.startsWith('.'))||file.startsWith(path.join(root,'server')+path.sep))return json(res,403,{error:'Forbidden'});
 try{const data=fs.readFileSync(file);res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'}[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{return json(res,404,{error:'Not found'});}
});
server.listen(Number(process.env.PORT)||5600,'127.0.0.1',()=>console.log('Madaar server: http://127.0.0.1:5600'));
