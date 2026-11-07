#!/usr/bin/env python3
"""Baixa obras de domínio público / fotos licenciadas e incorpora no GitHub Pages.

Nenhuma imagem é carregada de servidores externos no tempo de execução do app.
O script conserva crédito e fonte de cada obra em feed-data.js.
"""
from __future__ import annotations

import io
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import quote, unquote, urlparse

import requests
from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "feed-data.js"
OUT = ROOT / "assets" / "feed"
OUT.mkdir(parents=True, exist_ok=True)
AGENT = "CUIUDO/1.0 (faith-and-action-site; github.com/DevBrunoo/Terc0-homens)"
HEADERS = {"User-Agent": AGENT, "Accept": "image/avif,image/webp,image/jpeg,image/png,*/*"}
source = DATA.read_text(encoding="utf-8")
pattern = re.compile(
    r"(const feedArtwork = Object\.freeze\()(\{.*?\})(\);\s*const feedFilters)",
    re.DOTALL,
)
matched = pattern.search(source)
if not matched:
    sys.exit("ERRO: feedArtwork não encontrado em feed-data.js")
artworks = json.loads(matched.group(2))
session = requests.Session()
session.headers.update(HEADERS)


def get(url: str, timeout: int = 40) -> bytes:
    error = None
    for attempt in range(3):
        try:
            response = session.get(url, timeout=timeout, allow_redirects=True)
            response.raise_for_status()
            if not response.content:
                raise ValueError("Arquivo vazio")
            return response.content
        except (requests.RequestException, ValueError) as exc:
            error = exc
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"{url}: {error}")


def original_urls(info: dict) -> list[str]:
    source_url = info["source"]
    if "commons.wikimedia.org/wiki/File:" not in source_url:
        return [info["url"]]
    filename = unquote(source_url.split("/wiki/File:", 1)[1]).replace("_", " ")
    title = "File:" + filename
    possibilities = []
    try:
        # A API retorna o hash / caminho corretos, em vez de adivinhar
        # a pasta e o nome do arquivo no CDN.
        api = (
            "https://commons.wikimedia.org/w/api.php?action=query"
            "&format=json&formatversion=2&prop=imageinfo&iiprop=url"
            "&iiurlwidth=850&titles=" + quote(title, safe="")
        )
        response = json.loads(get(api).decode("utf-8"))
        images = response.get("query", {}).get("pages", [{}])[0].get("imageinfo", [])
        if images:
            possibilities.extend([images[0].get("thumburl"), images[0].get("url")])
    except Exception as exc:
        print(f"  Wikimedia API indisponível: {exc}", flush=True)
    # Tenta os caminhos anteriores se a API estiver indisponível.
    possibilities.append(info.get("url"))
    # Especial: o servidor resolve o hash do arquivo automaticamente.
    possibilities.append("https://commons.wikimedia.org/wiki/Special:Redirect/file/" + quote(filename, safe=""))
    return [url for url in dict.fromkeys(possibilities) if url]


def image_bytes(info: dict) -> bytes:
    failures = []
    for url in original_urls(info):
        try:
            raw = get(url)
            with Image.open(io.BytesIO(raw)) as im:
                im.verify()
            return raw
        except (RuntimeError, UnidentifiedImageError, OSError) as exc:
            failures.append(str(exc)[:120])
    raise RuntimeError("; ".join(failures))


def optimize(raw: bytes, outpath: Path) -> None:
    with Image.open(io.BytesIO(raw)) as image:
        image = ImageOps.exif_transpose(image)
        image = image.convert("RGB")
        if image.width < 240 or image.height < 240:
            raise ValueError("Imagem com resolução insuficiente")
        image.thumbnail((980, 1320), Image.Resampling.LANCZOS)
        image.save(outpath, "WEBP", quality=78, method=6)
    if outpath.stat().st_size < 8000:
        raise ValueError("WebP anormalmente pequeno")


ok = 0
failed = []
for art_id, metadata in artworks.items():
    print("Processando", art_id, flush=True)
    dest = OUT / (art_id + ".webp")
    try:
        if not dest.is_file():
            optimize(image_bytes(metadata), dest)
        else:
            with Image.open(dest) as im:
                im.verify()
        metadata["url"] = "./assets/feed/" + art_id + ".webp"
        ok += 1
        print("  OK", dest.name, dest.stat().st_size, "bytes", flush=True)
    except Exception as exc:
        failed.append((art_id, str(exc)[:280]))
        if dest.is_file():
            dest.unlink()
        metadata["url"] = "./assets/feed/fallback.svg"
        print("  FALHA; usando SVG local:", str(exc)[:200], flush=True)

# O feed fica seguro mesmo quando um servidor de arte estiver fora do ar.
replacement = (
    matched.group(1) +
    json.dumps(artworks, ensure_ascii=False, indent=2) +
    matched.group(3)
)
DATA.write_text(source[:matched.start()] + replacement + source[matched.end():], encoding="utf-8")
print(f"Imagens locais válidas: {ok}/{len(artworks)}")
for art_id, error in failed:
    print("PENDENTE", art_id, error)
# Se nenhuma foto estiver acessível, evitamos publicar um feed inteiro sem fotos.
if ok < 4:
    sys.exit("ERRO: menos de 4 imagens reais disponíveis; nada será publicado")
