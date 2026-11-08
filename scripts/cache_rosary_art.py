#!/usr/bin/env python3
"""Cria acervo local com 20 pinturas sacras ilustrando os mistérios do terço.

Busca Wikimedia Commons, baixa obras em domínio público ou com licença Creative Commons,
converte em WebP e grava créditos verificáveis em rosary-artwork.js. Não publica
links de imagens externas nem inventa autoria. Mantém os SVGs anteriores como
fallback de acessibilidade, se uma fonte estiver temporariamente indisponível.
"""
from __future__ import annotations

import html
import io
import json
import re
import time
from pathlib import Path
from urllib.parse import quote

import requests
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets'/'misterios'/'fotos'
OUT.mkdir(parents=True,exist_ok=True)
HEADERS={'User-Agent':'CUIUDO-rosary-art/1.0 (github.com/DevBrunoo/Terc0-homens)', 'Accept':'application/json,image/webp,image/jpeg,image/png,*/*'}
session=requests.Session()
session.headers.update(HEADERS)
API='https://commons.wikimedia.org/w/api.php'
SEARCHES={
 'anunciacao':['Fra Angelico Annunciation 1430','Annunciation Leonardo da Vinci','Annunciation painting'],
 'visitacao':['Visitation Ghirlandaio Mary Elizabeth','Visitation Pontormo painting','Visitation Mary Elizabeth painting'],
 'nascimento':['Adoration shepherds Gerard van Honthorst','Nativity Giotto painting','Nativity Jesus painting'],
 'apresentacao':['Presentation of Jesus in the Temple painting','Presentation in the Temple Giovanni Bellini'],
 'encontro':['Christ among the Doctors Durer','Finding Jesus in the Temple painting','Christ Among the Doctors painting'],
 'agonia':['Agony in the Garden Andrea Mantegna','Agony in the Garden El Greco painting'],
 'flagelacao':['Flagellation of Christ Caravaggio','Flagellation of Christ painting'],
 'espinhos':['Crowning with Thorns Titian painting','Christ crowned with thorns painting'],
 'cruz':['Christ Carrying the Cross El Greco','Carrying the Cross Titian painting'],
 'crucificacao':['Christ on the Cross Velazquez','Crucifixion Jesus Christ painting','Crucifixion Christ 1600 painting','Jesus crucified painting'],
 'ressurreicao':['Resurrection of Christ Perugino','Resurrection Jesus Christ painting','Resurrection of Christ fresco','Christ risen painting'],
 'ascensao':['Ascension of Christ Giotto','Ascension of Christ painting'],
 'pentecostes':['Pentecost El Greco painting','Pentecost painting descent Holy Spirit'],
 'assuncao':['Assumption of the Virgin Titian','Assumption of Mary Rubens painting'],
 'coroacao':['Coronation of the Virgin Fra Angelico','Coronation of the Virgin painting'],
 'batismo':['Baptism of Christ Verrocchio','Baptism of Christ Piero della Francesca'],
 'cana':['Wedding at Cana Veronese','Marriage at Cana painting'],
 'reino':['Christ Preaching Rembrandt','Sermon on the Mount Carl Bloch','Jesus preaching painting'],
 'transfiguracao':['Transfiguration Raphael painting','Transfiguration of Jesus painting'],
 'eucaristia':['Last Supper Leonardo da Vinci','Institution of the Eucharist painting','Last Supper painting Jesus']
}
SKIP=('graphic','icon','poster','statue','sculpture','glass','fresco reproduction photograph','cartoon','meme','diagram','advertisement')
def fetch(url,params=None,timeout=50):
 for attempt in range(3):
  try:
   r=session.get(url,params=params,timeout=timeout)
   r.raise_for_status()
   if len(r.content)>14_000_000:raise ValueError('arquivo muito grande')
   return r.content
  except (requests.RequestException,ValueError):
   if attempt==2:raise
   time.sleep(1.5*(attempt+1))
def license_ok(info):
 metadata=info.get('extmetadata') or {}
 label=str((metadata.get('LicenseShortName') or {}).get('value',''))
 link=str((metadata.get('LicenseUrl') or {}).get('value',''))
 return bool(re.search(r'public domain|^PD|^CC0\b|CC BY(?:-SA)?',label,re.I) or re.search(r'publicdomain|creativecommons.org/(?:publicdomain|licenses/by)',link,re.I))
def search(query):
 args={'action':'query','generator':'search','gsrsearch':query,'gsrnamespace':6,'gsrlimit':26,'prop':'imageinfo',
       'iiprop':'url|size|extmetadata','iiurlwidth':1080,'format':'json','formatversion':'2'}
 response=json.loads(fetch(API,args).decode('utf-8'))
 return response.get('query',{}).get('pages',[])
def score(page,query):
 title=page.get('title','').lower()
 words=[w for w in re.split(r'\W+',query.lower()) if len(w)>3]
 hits=sum(1 for w in words if w in title)
 info=(page.get('imageinfo') or [{}])[0]
 if not license_ok(info):return -1
 w,h=info.get('width',0),info.get('height',0)
 if w<550 or h<500 or w*h<330_000:return -1
 if not re.search(r'\.(jpg|jpeg|png|webp)$',title):return -1
 if any(s in title for s in SKIP):return -1
 ratio=w/h
 geometry=4 if .58<ratio<1.35 else 1
 title_clean=title.replace('file:','').split('(')[0]
 return hits*6+geometry+min(len(words),6)-(9 if 'detail' in title else 0)
def resolve_art(key):
 considered=[]
 for q in SEARCHES[key]:
  try:
   choices=search(q)
  except Exception as exc:
   print('  busca falhou:',q,str(exc)[:140],flush=True);continue
  for page in choices:
   points=score(page,q)
   if points<0:continue
   info=page['imageinfo'][0]
   url=info.get('thumburl') or info.get('url')
   if url: considered.append((points,page,url))
  considered.sort(key=lambda x:x[0],reverse=True)
  if considered and considered[0][0]>=15:break
 if not considered:raise RuntimeError('nenhuma reprodução em domínio público verificada')
 return considered
used=set()
gallery={}
ok=0
for key in SEARCHES:
 print('MISTÉRIO',key,flush=True)
 dest=OUT/(key+'.webp')
 try:
  choices=resolve_art(key)
  error=None
  for points,page,url in choices[:12]:
   name=page.get('title','').removeprefix('File:')
   if name in used:continue
   try:
    blob=fetch(url)
    with Image.open(io.BytesIO(blob)) as im:
     im.verify()
    with Image.open(io.BytesIO(blob)) as im:
     im=ImageOps.exif_transpose(im).convert('RGB')
     im.thumbnail((1000,1330),Image.Resampling.LANCZOS)
     if min(im.size)<360:raise ValueError('resolução insuficiente')
     im.save(dest,'WEBP',quality=78,method=6)
    if dest.stat().st_size<9000:raise ValueError('WebP incompleto')
    meta=page['imageinfo'][0].get('extmetadata') or {}
    license_name=html.unescape(re.sub('<[^>]*>','',str((meta.get('LicenseShortName') or {}).get('value','Public domain'))))
    url_source='https://commons.wikimedia.org/wiki/'+quote(page['title'].replace(' ','_'),safe=':_(),-')
    gallery[key]={'url':'./assets/misterios/fotos/'+key+'.webp','credit':name.replace('_',' '),
      'source':url_source,'license':license_name}
    used.add(name)
    ok+=1
    print(' OK',key,dest.stat().st_size,'bytes',name,flush=True)
    error=None
    break
   except Exception as exc:
    error=str(exc);print('  alternativa falhou:',str(exc)[:80],flush=True)
  if key not in gallery:
   raise RuntimeError(error or 'alternativas esgotadas')
 except Exception as exc:
  print(' FALHA',key,str(exc)[:180],flush=True)
  gallery[key]={'url':'./assets/misterios/'+key+'.svg',
    'credit':'Ilustração vetorial original do CUIÚDO','source':'','license':'Arte original'}
# JS mantém todas as imagens locais e crédito por obra
out='/* Galeria local de arte sacra, fontes verificadas no Wikimedia Commons. */\nconst rosaryArtwork=Object.freeze('+json.dumps(gallery,ensure_ascii=False,indent=2)+');\n'
(ROOT/'rosary-artwork.js').write_text(out,encoding='utf-8')
print(f'ARTES LOCAIS: {ok}/20',flush=True)
if ok<12:raise SystemExit('Baixa cobertura: menos de 12 imagens históricas baixadas')
