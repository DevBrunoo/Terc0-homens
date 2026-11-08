import json, re, io
from urllib.parse import urlsplit,urlunsplit
from pathlib import Path
import requests
from PIL import Image
sources=json.loads("[{\"path\":\"assets/medalha-sao-bento-colorida.webp\",\"url\":\"https://media.canva.com/v2/image-resize/format:JPG/height:200/quality:75/uri:ifs%3A%2F%2FM%2Faa065ff9-20e0-4f06-b39e-504c4f251855/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAALa8Mfk2kD38r-oLC2NwOgby8rdSJxUfG1Ux5RnGHS9c&exp=1794125244&osig=AAAAAAAAAAAAAAAAAAAAAHsfcDeu_Nkd2Gi_1VIXJU3xuUsA0Kf4s0CO4kJPdUuu&signer=media-rpc&token=AAIAAU0AJGFhMDY1ZmY5LTIwZTAtNGYwNi1iMzllLTUwNGM0ZjI1MTg1NQAAAAABoboypmDeZTJ7SHuINsnwWD9UulD0X6gRz_ef190mOFpkVZZh2A&x-canva-quality=thumbnail\",\"width\":736,\"height\":736},{\"path\":\"assets/sao-bento-arte-enviada.webp\",\"url\":\"https://media.canva.com/v2/image-resize/format:JPG/height:200/quality:75/uri:ifs%3A%2F%2FM%2Ffb3961f4-7eaf-4814-a4e8-5990fd0fbd34/watermark:F/width:112?csig=AAAAAAAAAAAAAAAAAAAAAP3SRT4uP8NYapREhlIadwYDvot-ROXufWHgu1WeCcGF&exp=1794123837&osig=AAAAAAAAAAAAAAAAAAAAAG7XcnZmZ9A7ctpqQcKvwT7M2EDTjvZAMWJOsgnlT_l_&signer=media-rpc&token=AAIAAU0AJGZiMzk2MWY0LTdlYWYtNDgxNC1hNGU4LTU5OTBmZDBmYmQzNAAAAAABobodLkjj4hRIOO44HIsvepmG-w3hXAECpN2qn1Vqg2k6U7GaFg&x-canva-quality=thumbnail\",\"width\":675,\"height\":1200}]")
session=requests.Session()
session.headers.update({"User-Agent":"Mozilla/5.0"})
for src in sources:
 original=src['url']; part=urlsplit(original)
 height=src['height']; width=src['width']
 resized=re.sub(r'/height:\d+',f'/height:{height}',re.sub(r'/width:\d+',f'/width:{width}',part.path))
 print('resized?',part.path!=resized,flush=True)
 urls=[urlunsplit((part.scheme,part.netloc,resized,part.query,''))]
 # Additional common CDN URL variants with same original Canva grant.
 urls.append(urlunsplit((part.scheme,part.netloc,resized,part.query.replace('x-canva-quality=thumbnail','x-canva-quality=normal'),'')))
 ok=False
 for i,url in enumerate(urls):
  try:
   r=session.get(url,timeout=22)
   print(src['path'],i,'http',r.status_code,'bytes',len(r.content),flush=True)
   if r.status_code!=200:continue
   with Image.open(io.BytesIO(r.content)) as im:
    im.load()
    print('new original output resolution',im.size,flush=True)
    if im.height<400 or im.width<300:continue
    im=im.convert('RGB'); dest=Path(src['path']); dest.parent.mkdir(parents=True,exist_ok=True)
    im.save(dest,'WEBP',quality=87,method=6)
    print('IMPROVED',dest,im.size,flush=True)
    ok=True;break
  except Exception as e:print('probe failed',str(e)[:150],flush=True)
 if not ok:print('CDN only permits signed thumbnail for',src['path'],flush=True)
