import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.json':'application/json'};
createServer(async(req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const filename=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(filename!==root && !filename.startsWith(root+sep)){res.writeHead(403).end('Negado');return;}
  try{const data=await readFile(filename);res.writeHead(200,{'Content-Type':types[extname(filename)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}
  catch{res.writeHead(404).end('Não encontrado');}
}).listen(8000,'0.0.0.0',()=>console.log('CUIÚDO em http://localhost:8000'));
