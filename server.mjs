import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { parseArgs } from 'node:util';
const {values}=parseArgs({options:{host:{type:'string',default:'0.0.0.0'},port:{type:'string',default:'8000'},strictPort:{type:'boolean'}}});
const port=Number(values.port);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Porta inválida');
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.json':'application/json'};
createServer(async(req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const filename=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(filename!==root && !filename.startsWith(root+sep)){res.writeHead(403).end('Negado');return;}
  try{const data=await readFile(filename);res.writeHead(200,{'Content-Type':types[extname(filename)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}
  catch{res.writeHead(404).end('Não encontrado');}
}).listen(port,values.host,()=>console.log('CUIÚDO em http://'+values.host+':'+port));
