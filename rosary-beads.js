/* CUIÚDO v16 — contador real de cada dezena em formato de terço.
 * Um Pai-Nosso + dez Ave-Marias + um Glória ao Pai.
 * Contas clicáveis, leitura acessível e estado salvo no dispositivo.
 */
const cuiudoBeadLabels={
 pt:{title:'Contador do santo terço',subtitle:'1 Pai-Nosso · 10 Ave-Marias · 1 Glória',father:'Pai-Nosso',hail:'Ave-Maria',glory:'Glória ao Pai',
  fatherDone:'Pai-Nosso rezado',gloryDone:'Glória rezado',firstFather:'Comece pelo Pai-Nosso',nextHail:'Próxima Ave-Maria',finishGlory:'Encerre com o Glória',
  added:'Rezei uma Ave-Maria',complete:'Dezena completa',undo:'Voltar uma conta',reset:'Reiniciar dezena',previous:'Anterior',next:'Próximo mistério',overall:'Mistérios rezados',
  begin:'Marcar Pai-Nosso',end:'Marcar Glória',undoFather:'Desmarcar Pai-Nosso',undoGlory:'Desmarcar Glória',step:'Toque em cada conta na sequência',repetition:'10 Ave-Marias'},
 en:{title:'Rosary bead counter',subtitle:'1 Our Father · 10 Hail Marys · 1 Glory Be',father:'Our Father',hail:'Hail Mary',glory:'Glory Be',
  fatherDone:'Our Father prayed',gloryDone:'Glory Be prayed',firstFather:'Start with Our Father',nextHail:'Next Hail Mary',finishGlory:'Finish with Glory Be',
  added:'I prayed a Hail Mary',complete:'Decade completed',undo:'Undo a bead',reset:'Reset decade',previous:'Previous',next:'Next mystery',overall:'Mysteries prayed',
  begin:'Mark Our Father',end:'Mark Glory Be',undoFather:'Unmark Our Father',undoGlory:'Unmark Glory Be',step:'Tap each bead in order',repetition:'10 Hail Marys'},
 es:{title:'Contador del Rosario',subtitle:'1 Padrenuestro · 10 Avemarías · 1 Gloria',father:'Padrenuestro',hail:'Avemaría',glory:'Gloria al Padre',
  fatherDone:'Padrenuestro rezado',gloryDone:'Gloria rezado',firstFather:'Empieza con el Padrenuestro',nextHail:'Siguiente Avemaría',finishGlory:'Termina con el Gloria',
  added:'He rezado un Avemaría',complete:'Decena completa',undo:'Deshacer una cuenta',reset:'Reiniciar decena',previous:'Anterior',next:'Siguiente misterio',overall:'Misterios rezados',
  begin:'Marcar Padrenuestro',end:'Marcar Gloria',undoFather:'Desmarcar Padrenuestro',undoGlory:'Desmarcar Gloria',step:'Toca cada cuenta en orden',repetition:'10 Avemarías'},
 la:{title:'Numerus precum Rosarii',subtitle:'1 Pater noster · 10 Ave Maria · 1 Gloria Patri',father:'Pater noster',hail:'Ave Maria',glory:'Gloria Patri',
  fatherDone:'Pater noster recitatus',gloryDone:'Gloria recitata',firstFather:'Pater noster incipe',nextHail:'Sequens Ave Maria',finishGlory:'Gloria Patri conclude',
  added:'Ave Maria dixi',complete:'Decas completa',undo:'Unam globulam revoca',reset:'Decadem repete',previous:'Prius',next:'Sequens mysterium',overall:'Mysteria recitata',
  begin:'Pater noster signa',end:'Gloria Patri signa',undoFather:'Pater noster revoca',undoGlory:'Gloria revoca',step:'Singulas globulas ordine tange',repetition:'10 Ave Maria'}
};
function cuiudoDecadeKey(){
 return currentDay()+':'+state.group+':'+state.mystery;
}
function cuiudoDecadeFlags(){
 const k=cuiudoDecadeKey(),item=state.decadePrayers?.[k];
 return {father:Boolean(item?.father),glory:Boolean(item?.glory)};
}
function cuiudoSaveDecadeFlags(flags){
 state.decadePrayers??={};
 state.decadePrayers[cuiudoDecadeKey()]={father:Boolean(flags.father),glory:Boolean(flags.glory)};
 save();
}
function cuiudoDecadeComplete(index=state.mystery){
 const k=currentDay()+':'+state.group+':'+index;
 const data=state.decadePrayers?.[k]||{};
 const progress=readProgress()[index]||0;
 return Boolean(data.father&&data.glory&&progress===10);
}
function cuiudoBeadNode(x,y,type,index,done,enabled,label){
 return '<button type="button" class="rosary-bead-node '+type+(done?' completed':'')+
   (enabled?' available':'')+'" style="left:'+(x/360*100).toFixed(3)+'%;top:'+(y/395*100).toFixed(3)+'%"'+
   ' data-action="'+(type==='father'?'rosary-father':type==='glory'?'rosary-glory':'rosary-hail')+'"'+
   (type==='hail'?' data-number="'+index+'"':'')+
   ' aria-label="'+escapeHtml(label)+'" aria-pressed="'+(done?'true':'false')+'"'+
   (!enabled?' disabled':'')+'><span aria-hidden="true">'+
   (type==='father'?'✝':type==='glory'?'✦':done?'✓':index)+'</span></button>';
}
function cuiudoDecadeVisual(){
 const l=cuiudoLocale(),t=cuiudoBeadLabels[l],n=readProgress()[state.mystery];
 const flags=cuiudoDecadeFlags(),completed=cuiudoDecadeComplete();
 const prayers=cuiudoPrayersList();
 const father=prayers.find(p=>/Pai-Nosso|Our Father|Padrenuestro|Pater noster/i.test(p.name))||prayers[1];
 const hail=prayers.find(p=>/Ave-Maria|Hail Mary|Avemaría|Ave Maria/i.test(p.name))||prayers[2];
 const glory=prayers.find(p=>/Glória|Glory|Gloria/i.test(p.name))||prayers[3];
 const beads=Array.from({length:10},(_,i)=>{
   const a=(-90+36*i)*Math.PI/180;
   const x=180+123*Math.cos(a),y=202+118*Math.sin(a);
   return cuiudoBeadNode(x,y,'hail',i+1,i<n,flags.father&&i<=n,
    (i+1)+' / 10 · '+t.hail+(i<n?' ✓':''));
 }).join('');
 const next=completed?t.complete:!flags.father?t.firstFather:n<10?t.nextHail:t.finishGlory;
 const g=groups[state.group],progress=readProgress();
 return '<section class="decade-panel rosary-bead-counter">'+
   '<div class="rosary-beads-heading"><div><span class="eyebrow">'+escapeHtml(t.title)+'</span>'+
   '<h2>'+escapeHtml(t.subtitle)+'</h2><p>'+escapeHtml(t.step)+'</p></div>'+
   '<span class="rosary-beads-tally">'+n+' / 10</span></div>'+
   '<div class="rosary-bead-layout"><div class="rosary-bead-visual">'+
    '<svg class="rosary-bead-thread" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 395" role="presentation" aria-hidden="true">'+
      '<path d="M180 29L180 84M180 84C248 84 303 137 303 202C303 267 248 320 180 320C112 320 57 267 57 202C57 137 112 84 180 84Z M180 320L180 367" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'+
      '<path d="M176 367h8m-4-7v28m-9-20h18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'+
    '</svg>'+
    cuiudoBeadNode(180,28,'father',null,flags.father,true,t.father)+
    beads+
    cuiudoBeadNode(180,367,'glory',null,flags.glory,n===10,t.glory)+
    '<div class="rosary-bead-center"><span>✝</span><strong>'+escapeHtml(next)+'</strong><small>'+
       escapeHtml(t.repetition)+'</small></div></div>'+
   '<div class="rosary-bead-guide"><div class="rosary-prayer-status">'+
    '<div class="rosary-prayer-row '+(flags.father?'is-done':'')+'"><span class="rosary-prayer-number">01</span>'+
     '<div><strong>'+escapeHtml(t.father)+'</strong><small>'+escapeHtml(flags.father?t.fatherDone:t.firstFather)+'</small></div>'+
     '<button type="button" data-action="rosary-father" class="rosary-status-btn" aria-pressed="'+flags.father+'">'+
       (flags.father?'✓ '+escapeHtml(t.undoFather):escapeHtml(t.begin))+'</button></div>'+
    '<div class="rosary-prayer-row '+(n===10?'is-done':'')+'"><span class="rosary-prayer-number">02</span>'+
     '<div><strong>'+escapeHtml(t.repetition)+'</strong><small>'+n+' / 10</small></div>'+
     '<button type="button" data-action="add-bead" class="rosary-status-btn" '+(!flags.father||n>=10?'disabled':'')+'>'+
       escapeHtml(n>=10?t.complete:t.added)+'</button></div>'+
    '<div class="rosary-prayer-row '+(flags.glory?'is-done':'')+'"><span class="rosary-prayer-number">03</span>'+
     '<div><strong>'+escapeHtml(t.glory)+'</strong><small>'+escapeHtml(flags.glory?t.gloryDone:t.finishGlory)+'</small></div>'+
     '<button type="button" data-action="rosary-glory" class="rosary-status-btn" '+(n<10?'disabled':'')+
       ' aria-pressed="'+flags.glory+'">'+(flags.glory?'✓ '+escapeHtml(t.undoGlory):escapeHtml(t.end))+'</button></div>'+
    '</div>'+
    '<div class="rosary-prayer-toggle"><details><summary>'+escapeHtml(t.father)+'</summary><p>'+escapeHtml(father?.text||'')+'</p></details>'+
      '<details><summary>'+escapeHtml(t.hail)+'</summary><p>'+escapeHtml(hail?.text||'')+'</p></details>'+
      '<details><summary>'+escapeHtml(t.glory)+'</summary><p>'+escapeHtml(glory?.text||'')+'</p></details></div>'+
    '<div class="rosary-bead-actions"><button type="button" class="btn btn-secondary" data-action="undo-bead" '+(n===0?'disabled':'')+'>'+
      escapeHtml(t.undo)+'</button><button type="button" class="btn btn-ghost" data-action="rosary-reset-all">'+escapeHtml(t.reset)+'</button></div>'+
    '</div></div>'+
   '<div class="rosary-mystery-steps" role="group" aria-label="'+escapeHtml(t.overall)+'">'+
    g.mysteries.map((item,i)=>'<button type="button" class="rosary-mystery-step '+(state.mystery===i?'current':'')+
     (cuiudoDecadeComplete(i)?' complete':'')+'" data-action="mystery" data-index="'+i+
     '" aria-label="'+escapeHtml(cuiudoMystery(item).title)+'" aria-current="'+(state.mystery===i?'step':'false')+
     '">'+(cuiudoDecadeComplete(i)?'✓':i+1)+'</button>').join('')+'</div>'+
   '<div class="two-buttons"><button class="btn btn-muted" data-action="prev-mystery" '+(state.mystery===0?'disabled':'')+'>'+
    escapeHtml(t.previous)+'</button><button class="btn btn-ghost" data-action="next-mystery" '+(state.mystery===4?'disabled':'')+'>'+
    escapeHtml(t.next)+'</button></div>'+
   (g.mysteries.every((_,i)=>cuiudoDecadeComplete(i))?'<div class="action-line">✓ '+escapeHtml(cuiudoStrings().complete)+'</div>':'')+
   '</section>';
}
const cuiudoRosaryBeforeBeads=cuiudoRosary;
cuiudoRosary=function(){
 const html=cuiudoRosaryBeforeBeads();
 const start=html.indexOf('<section class="decade-panel">');
 const end=start>=0?html.indexOf('</section>',start):-1;
 if(end<0)return html;
 return html.slice(0,start)+cuiudoDecadeVisual()+html.slice(end+10);
};
app.addEventListener('click',event=>{
 const control=event.target.closest?.('[data-action]');
 if(!control)return;
 const action=control.dataset.action;
 if(!['rosary-father','rosary-hail','rosary-glory','rosary-reset-all'].includes(action))return;
 const flag=cuiudoDecadeFlags(),count=readProgress()[state.mystery];
 if(action==='rosary-father'){
  if(flag.father&&count>0)return; // não permitir apagar Pai-Nosso após as Avé-Marias
  flag.father=!flag.father; if(!flag.father)flag.glory=false;
  cuiudoSaveDecadeFlags(flag);
 }
 if(action==='rosary-hail'){
  const n=Number(control.dataset.number);
  if(flag.father&&n>=1&&n<=10&&n<=count+1){
   changeCount(n);if(n<10){flag.glory=false;cuiudoSaveDecadeFlags(flag);}
  }
 }
 if(action==='rosary-glory'&&count===10){
  flag.glory=!flag.glory;cuiudoSaveDecadeFlags(flag);
 }
 if(action==='rosary-reset-all'&&confirm('Reiniciar Pai-Nosso, dez Ave-Marias e Glória nesta dezena?')){
  changeCount(0);cuiudoSaveDecadeFlags({father:false,glory:false});
 }
 render();
});
render();
