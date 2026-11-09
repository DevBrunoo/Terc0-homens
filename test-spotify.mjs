import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const code=readFileSync(new URL('./spotify-dock.js',import.meta.url),'utf8');
const saved=new Map(),listeners=[];
const mock={
 document:{addEventListener(type,listener){listeners.push([type,listener]);}},
 localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},
 state:{appLang:'pt'},
 URL,
 console
};
const context=createContext(mock);
runInContext(code,context,{timeout:3000});
const parse=value=>runInContext('cuiudoSpotify.parse('+JSON.stringify(value)+')',context);
const track='0Lr4kGOYn9l83EjuK6cZFQ',playlist='37i9dQZF1DXcBWIGoYBM5M';
assert.equal(parse('https://open.spotify.com/track/'+track+'?si=abc'), 'https://open.spotify.com/embed/track/'+track);
assert.equal(parse('https://open.spotify.com/intl-pt/playlist/'+playlist),'https://open.spotify.com/embed/playlist/'+playlist);
assert.equal(parse('spotify:track:'+track),'https://open.spotify.com/embed/track/'+track);
assert.equal(parse('https://open.spotify.com/album/'+track),'https://open.spotify.com/embed/album/'+track);
for(const value of [
 'https://evil.test/track/'+track,
 'https://open.spotify.com.evil.test/track/'+track,
 'javascript:alert(1)',
 'https://open.spotify.com/collection/tracks',
 'https://open.spotify.com/track/'+track+'/extra',
 'https://spotify.link/abc',
 'https://open.spotify.com/track/not-valid',
 'https://open.spotify.com/track/'+track+'@evil.com'
])assert.equal(parse(value),null,'Rejeitar link inválido: '+value);
assert.ok(listeners.some(([name])=>name==='click'),'Botão Spotify tem ação de abertura');
assert.match(code,/document\.body\.appendChild\(root\)/,'Player separado do #app persiste entre trocas de página');
assert.match(code,/src=url/,'Iframe usa apenas URL oficial validada');
assert.match(readFileSync(new URL('./index.html',import.meta.url),'utf8'),/spotify-dock\.js/);
assert.match(readFileSync(new URL('./sw.js',import.meta.url),'utf8'),/spotify-dock\.js/);
assert.match(readFileSync(new URL('./scripts\/build-cloudflare.mjs',import.meta.url),'utf8'),/spotify-dock\.js/);
console.log('✓ Spotify: URL segura, integração no site, player persistente sem OAuth enganoso');
