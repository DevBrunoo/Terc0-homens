#!/usr/bin/env python3
"""CUIÚDO v16. Acervo livre e em alta: medalha vetorial, santos e cânticos.
Fontes/autor/licenças estão registrados em ASSET_CREDITS.
Não usa vídeo YouTube, nem baixa música sem licença.
"""
from __future__ import annotations
import io, json, re, subprocess, time
from pathlib import Path
from urllib.parse import urlencode
import requests
from PIL import Image,ImageOps,ImageEnhance
API='https://commons.wikimedia.org/w/api.php'
S=requests.Session()
S.headers.update({'User-Agent':'CuiudoRosary/1.6 (devbrunoo.github.io/Terc0-homens; educational open-license imports)','Accept':'application/json, image/*, audio/*, */*'})
ROOT=Path(__file__).resolve().parents[1]
ASSET_CREDITS={
 'assets/medalha-sao-bento-hd.svg':('St Benedict Medal icon.svg','public_domain','Medalha de São Bento em vetor colorido; Sy.Paul, domínio público'),
 'assets/santos-todos-fra-angelico.webp':('All-Saints.jpg','public_domain','Fra Angelico, The Forerunners of Christ with Saints and Martyrs; domínio público'),
 'assets/santos-coroacao-fra-angelico.webp':('Fra Angelico — Coronation of the Virgin.jpg','cc0','Fra Angelico, Coroação da Virgem, fotografia de Gleb Simonov, CC0 1.0'),
 'assets/sao-bento-gravura-hd.webp':('Saint Benedict. Engraving by F.L. Schmitner. Wellcome V0048893.jpg','public_domain','São Bento, gravura histórica de F. L. Schmitner, Wellcome Collection, domínio público'),
 'assets/audio/cantico-pange-lingua.mp3':('Pange Lingua Latin in Latin.ogg','by_sa_3','Gareth Hughes, Pange Lingua, CC BY-SA 3.0'),
 'assets/audio/cantico-tantum-ergo.mp3':('Tantum Ergo I Gregorian.ogg','by_sa_3','Gareth Hughes / Richardprins, Tantum Ergo, CC BY-SA 3.0'),
 'assets/audio/cantico-pater-noster.mp3':('Schola Gregoriana-Pater Noster.ogg','by_sa_3','Schola Gregoriana de Ołtarzew, Pater Noster, CC BY-SA 3.0'),
 'assets/audio/cantico-rorate-caeli.mp3':('Rorate Caeli ~ Gregorian Chant.ogg','by_sa_4','Inritter, Rorate Caeli, CC BY-SA 4.0')
}
def get(url,params=None):
 error=None
 for attempt in range(6):
  try:
   r=S.get(url,params=params,timeout=95)
   r.raise_for_status()
   if not r.content:raise ValueError('Resposta vazia')
   return r.content
  except Exception as e:
   error=e;time.sleep(2*(attempt+1))
 raise RuntimeError(str(error))
def info(title,thumb=None):
 p={'action':'query','prop':'imageinfo','iiprop':'url|size|extmetadata','titles':'File:'+title,'format':'json','formatversion':'2'}
 if thumb:p['iiurlwidth']=thumb
 data=json.loads(get(API,p))
 pages=data.get('query',{}).get('pages',[])
 if not pages or 'imageinfo' not in pages[0]:raise RuntimeError('Arquivo Commons não encontrado: '+title)
 return pages[0]['imageinfo'][0]
def license_ok(meta,target):
 x=meta.get('extmetadata',{})
 data=' '.join(str(x.get(y,{}).get('value','')) for y in ['LicenseShortName','LicenseUrl','UsageTerms','Copyrighted']).lower()
 if target=='public_domain':return ('public domain' in data or 'publicdomain' in data or 'pd-old' in data)
 if target=='cc0':return 'cc0' in data or 'cc-zero' in data or 'publicdomain/zero' in data or ('public domain' in data and 'attribution' not in data)
 if target=='by_sa_3':return 'by-sa/3.0' in data or 'by-sa-3.0' in data or 'attribution-sharealike 3.0' in data
 if target=='by_sa_4':return 'by-sa/4.0' in data or 'by-sa-4.0' in data or 'attribution-sharealike 4.0' in data
 return False
def image_file(dest, title,license):
 path=ROOT/dest;path.parent.mkdir(parents=True,exist_ok=True)
 data=info(title,1300 if dest.endswith('webp') else None)
 assert license_ok(data,license),f'License not approved: {title}: {data.get("extmetadata",{})}'
 payload=get(data.get('thumburl') or data['url'])
 if dest.endswith('.svg'):
  txt=payload.decode('utf-8-sig')
  assert '<svg' in txt and len(txt)>5000,'Corrupted SVG'
  assert '<script' not in txt.lower() and 'javascript:' not in txt.lower(),'Unsafe SVG'
  path.write_text(txt,encoding='utf-8')
 else:
  with Image.open(io.BytesIO(payload)) as im:
   im=ImageOps.exif_transpose(im).convert('RGB')
   im.thumbnail((1500,1400),Image.Resampling.LANCZOS)
   if im.width<550 or im.height<450:raise ValueError('Image too small '+title)
   im.save(path,'WEBP',quality=85,method=6)
 check=path.read_bytes()
 if dest.endswith('.webp'):assert check[:4]==b'RIFF' and check[8:12]==b'WEBP'
 print('OK artwork',dest,len(check),flush=True)
def audio_file(dest,title,license):
 path=ROOT/dest;path.parent.mkdir(parents=True,exist_ok=True)
 data=info(title)
 assert license_ok(data,license),f'License not approved: {title}'
 payload=get(data['url'])
 assert payload[:4]==b'OggS','Expected Ogg Vorbis'
 source=path.with_suffix('.tmp.ogg');source.write_bytes(payload)
 proc=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-i',str(source),'-vn','-ac','2','-ar','44100','-b:a','112k',str(path)],text=True,capture_output=True,timeout=140)
 source.unlink(missing_ok=True)
 if proc.returncode:raise RuntimeError(proc.stderr[:1500])
 assert path.stat().st_size>90000,'audio file incomplete'
 d=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(path)],capture_output=True,text=True,timeout=20)
 assert d.returncode==0 and float(d.stdout.strip())>20
 print('OK audio',dest,path.stat().st_size,d.stdout.strip(),flush=True)
def main():
 for dest,(title,license,credit) in ASSET_CREDITS.items():
  print('PROCESS',dest,'FROM',title,flush=True)
  (audio_file if dest.endswith('.mp3') else image_file)(dest,title,license)
 print('ALL 8 LICENSED ASSETS COMPLETE',flush=True)
if __name__=='__main__':main()
