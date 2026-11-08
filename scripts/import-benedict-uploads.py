#!/usr/bin/env python3
"""Copia temporariamente duas imagens enviadas pelo usuário para arquivos WebP locais.
 O link intermediário expira; os arquivos finais ficam no GitHub.
"""
from __future__ import annotations
import io,json,re
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit
import requests
from PIL import Image, ImageOps,ImageEnhance
IMAGES=json.loads("[{\"path\":\"medalha-sao-bento-colorida.webp\",\"source\":\"https://media.canva.com/v2/image-resize/format:JPG/height:200/quality:75/uri:ifs%3A%2F%2FM%2Faa065ff9-20e0-4f06-b39e-504c4f251855/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAALUY9kYVo4Qw8EHNdDEBIlfNvZyZ5rPD1FHFzzmpTZgZ&exp=1794121644&osig=AAAAAAAAAAAAAAAAAAAAAClgv_BE-RoWCKiNGDVfHWql7K9piLa-bHWQqt4iTjGU&signer=media-rpc&token=AAIAAU0AJGFhMDY1ZmY5LTIwZTAtNGYwNi1iMzllLTUwNGM0ZjI1MTg1NQAAAAABobn7t-CG1pOSS-W-5lqGRF2EwnzGZUGpf6PkrWIrT2f-symzSQ&x-canva-quality=thumbnail\",\"width\":0,\"height\":0},{\"path\":\"sao-bento-arte-enviada.webp\",\"source\":\"https://media.canva.com/v2/image-resize/format:JPG/height:200/quality:75/uri:ifs%3A%2F%2FM%2Ffb3961f4-7eaf-4814-a4e8-5990fd0fbd34/watermark:F/width:112?csig=AAAAAAAAAAAAAAAAAAAAAP3SRT4uP8NYapREhlIadwYDvot-ROXufWHgu1WeCcGF&exp=1794123837&osig=AAAAAAAAAAAAAAAAAAAAAG7XcnZmZ9A7ctpqQcKvwT7M2EDTjvZAMWJOsgnlT_l_&signer=media-rpc&token=AAIAAU0AJGZiMzk2MWY0LTdlYWYtNDgxNC1hNGU4LTU5OTBmZDBmYmQzNAAAAAABobodLkjj4hRIOO44HIsvepmG-w3hXAECpN2qn1Vqg2k6U7GaFg&x-canva-quality=thumbnail\",\"width\":0,\"height\":0}]")
s=requests.Session()
s.headers.update({"User-Agent":"Mozilla/5.0 CUIUDO image importer"})
for record in IMAGES:
 url=record['source']
 o=urlsplit(url)
 path=o.path
 wanted_width=record['width']
 wanted_height=record['height']
 variants=[
  urlunsplit((o.scheme,o.netloc,re.sub(r'/height:\\d+',f'/height:{wanted_height}',re.sub(r'/width:\\d+',f'/width:{wanted_width}',path)),o.query,'')),
  urlunsplit((o.scheme,o.netloc,path,o.query.replace('x-canva-quality=thumbnail','x-canva-quality=preview'),'')),
  url
 ]
 choices=[]
 for i,candidate in enumerate(variants):
  try:
   response=s.get(candidate,timeout=25)
   print(record['path'],'trial',i,'status',response.status_code,'bytes',len(response.content),flush=True)
   if response.status_code!=200:continue
   with Image.open(io.BytesIO(response.content)) as im:
    im.load()
    choices.append((im.width*im.height,im.copy()))
  except Exception as exc:print('candidate error',str(exc)[:160],flush=True)
 if not choices:raise RuntimeError('Não foi possível receber a imagem '+record['path'])
 area,im=max(choices,key=lambda x:x[0])
 im=ImageOps.exif_transpose(im).convert('RGB')
 print('source size',im.size,flush=True)
 if im.width<400:
  # Thumbnail signed available: upscale conservatively while preserving provided composition.
  dim=min(900,int(wanted_width))
  ratio=min(dim/max(1,im.width),2.8)
  im=im.resize((round(im.width*ratio),round(im.height*ratio)),Image.Resampling.LANCZOS)
  im=ImageEnhance.Sharpness(im).enhance(1.1)
 output=Path('assets')/record['path']; output.parent.mkdir(parents=True,exist_ok=True)
 im.save(output,'WEBP',quality=88,method=6)
 data=output.read_bytes()
 assert data[:4]==b'RIFF' and data[8:12]==b'WEBP'
 print('SAVED',output,'size',im.size,'bytes',len(data),flush=True)
