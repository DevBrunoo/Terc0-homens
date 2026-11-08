#!/usr/bin/env python3
"""Assets CUIÚDO: dois cânticos católicos gravados e quatro imagens licenciadas.

Áudio: Ave Maria (Schola Gregoriana), Cum Angelis (antífona medieval).
O segundo é denominado "estilo templário", sem atribuição histórica falsa.
Todos têm licença Commons revisada; MP3s são transcodificações via ffmpeg.
Medalha: fotografia real CC0 (frente e verso).
Pinturas: Frederic Remington, domínio público.
"""
import io
import json
import os
import re
import subprocess
import time
from pathlib import Path
from urllib.parse import quote

import requests
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
API='https://commons.wikimedia.org/w/api.php'
UA='CUIUDO-Catholic-Rosary/1.0 (github.com/DevBrunoo/Terc0-homens)'
S=requests.Session()
S.headers.update({'User-Agent':UA,'Accept':'application/json,image/*,audio/ogg,*/*'})
IMAGES={
 'assets/medalha-sao-bento-real.webp':('Saint Benedict Medal.jpg','cc0'),
 'assets/feed/ajudar-companheiro.webp':('Frederic Remington - Aiding a Comrade - Google Art Project.jpg','public'),
 'assets/feed/vai-pra-cima.webp':('Frederic Remington - A New Year on the Cimarron - Google Art Project.jpg','public'),
 'assets/feed/foco-estrada.webp':('The Smoke Signal, 1905, by Frederic S. Remington.jpg','public')
}
AUDIO={
 'assets/audio/cantico-catolico.mp3':('Schola Gregoriana-Ave Maria.ogg','CC BY-SA 3.0'),
 'assets/audio/cantico-medieval.mp3':('Gregorian chant - Procedamus in pace - Cum angelis - Psalm 24 (23) (German-Polish accent).ogg','CC BY-SA 3.0')
}
def fetch(url,params=None):
 err=None
 for attempt in range(4):
  try:
   r=S.get(url,params=params,timeout=80)
   r.raise_for_status()
   if not r.content:raise ValueError('resposta vazia')
   return r.content
  except Exception as exc:
   err=exc
   time.sleep(3*(attempt+1))
 raise RuntimeError(str(err))
def info(title,thumb=None):
 opts={'action':'query','format':'json','formatversion':'2','prop':'imageinfo',
 'iiprop':'url|size|extmetadata','titles':'File:'+title}
 if thumb:opts['iiurlwidth']=thumb
 payload=json.loads(fetch(API,opts).decode('utf-8'))
 pages=payload.get('query',{}).get('pages',[])
 if not pages or 'imageinfo' not in pages[0]:
  raise RuntimeError('Commons não reconheceu: '+title)
 return pages[0]['imageinfo'][0]
def licensetext(meta):
 m=meta.get('extmetadata',{})
 short=str(m.get('LicenseShortName',{}).get('value',''))
 url=str(m.get('LicenseUrl',{}).get('value',''))
 usage=str(m.get('UsageTerms',{}).get('value',''))
 return ' '.join([short,url,usage]).lower()
def license_ok(blob,kind):
 if kind=='cc0':return 'cc0' in blob or 'publicdomain/zero' in blob
 if kind=='public':return any(x in blob for x in ['public domain','publicdomain','cc0','pd-art','cc by','creativecommons.org/licenses/by'])
 return ('attribution-sharealike' in blob or 'cc by-sa' in blob or 'licenses/by-sa/3.0' in blob)
def download_images():
 from PIL import Image,ImageOps
 for out,(title,lic) in IMAGES.items():
  path=ROOT/out;path.parent.mkdir(parents=True,exist_ok=True)
  print('Imagem:',title,flush=True)
  data=info(title,1100)
  label=licensetext(data)
  assert license_ok(label,lic),f'Licença divergente: {title}: {label[:160]}'
  url=data.get('thumburl') or data['url']
  payload=fetch(url)
  with Image.open(io.BytesIO(payload)) as im:
   im=ImageOps.exif_transpose(im)
   im=im.convert('RGB')
   im.thumbnail((1400,1100),Image.Resampling.LANCZOS)
   if im.width<400 or im.height<380:raise ValueError('resolução baixa '+title)
   im.save(path,'WEBP',quality=81,method=6)
  if path.stat().st_size<17000:raise ValueError('arquivo incompleto '+out)
  print('OK imagem',out,path.stat().st_size,flush=True)
def download_audio():
 for out,(title,lic) in AUDIO.items():
  path=ROOT/out;path.parent.mkdir(parents=True,exist_ok=True)
  print('Cântico:',title,flush=True)
  data=info(title)
  label=licensetext(data)
  assert license_ok(label,lic),f'Licença não confirmada: {title}: {label[:160]}'
  url=data['url']
  payload=fetch(url)
  if not payload.startswith(b'OggS'):raise ValueError('Áudio não é Ogg Vorbis '+title)
  original=path.with_suffix('.source.ogg')
  original.write_bytes(payload)
  cmd=['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-y','-i',str(original),
   '-vn','-ac','2','-ar','44100','-b:a','112k',str(path)]
  result=subprocess.run(cmd,capture_output=True,text=True,timeout=100)
  original.unlink(missing_ok=True)
  if result.returncode!=0:raise RuntimeError(result.stderr[:900])
  if path.stat().st_size<30000 or path.read_bytes()[:3]!=b'ID3' and path.read_bytes()[:2]!=b'\xff\xfb':
   # ID3 can vary (first MP3 frame with other MPEG sync bits)
   if path.stat().st_size<30000:raise ValueError('MP3 incompleto')
  probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(path)],capture_output=True,text=True)
  if probe.returncode!=0 or float(probe.stdout.strip())<25:raise ValueError('Duração inválida')
  print('OK áudio',out,path.stat().st_size,'duração',probe.stdout.strip(),flush=True)
def main():
 download_images()
 download_audio()
 print('SUCESSO: 4 imagens reais e 2 cantos licenciados no repositório',flush=True)
if __name__=='__main__':main()
