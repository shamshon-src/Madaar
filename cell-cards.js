(() => {
  const make=(tag,text,cls)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;};
  const entries={
    lamp:{title:'مصباح',badge:'ضوء يساعدك',tone:'gold',symbol:'💡',detail:'حصلت على مصباح. استخدمه لطلب تلميح أثناء الإجابة عن سؤال.',chips:['تلميح واحد','يُستخدم مرة واحدة']},
    multiplier:{title:'مضاعفة ×٢',badge:'فرصة لمضاعفة النقاط',tone:'gold',symbol:'×2',detail:'تتضاعف نقاط السؤال العادي التالي؛ تبقى خطوات الحركة كما هي.',chips:['النقاط ×٢','الحركة كما هي']},
    retry:{title:'محطة الأمان',badge:'درع يحمي محاولتك',tone:'blue',symbol:'shield',detail:'تحتفظ بالحماية حتى أول خطأ في سؤال عادي، ثم تعيد السؤال مرة واحدة.',chips:['حتى أول خطأ','محاولة إضافية']},
    knowledge:{title:'محطة المعرفة',badge:'وقفة لاكتشاف معنى جديد',tone:'blue',symbol:'book',detail:'ومضة معرفية من موضوع رحلتك، دون نقاط أو حركة إضافية.',chips:['تعلّم واكتشف','ومضة معرفية']},
    speed:{title:'سباق الثواني',badge:'تحدَّ الزمن',tone:'red',symbol:'15',detail:'أجب عن بطاقة «اعرف» خلال 15 ثانية. النجاح يمنح نقطتين دون حركة إضافية.',chips:['اعرف · 15 ثانية','مكافأة نقطتين']},
    bigSolo:{title:'التحدي الكبير',badge:'ارتقِ بتحليلك',tone:'red',symbol:'star',detail:'اختر بطاقة «حلّل»: الإجابة المكتملة تمنح 3 نقاط دون حركة إضافية، أو تابع بسؤال عادي.',chips:['حلّل','مكافأة 3 نقاط']},
    super:{title:'التحدي الكبير',badge:'اختر من يخوض التحدي',tone:'red',symbol:'star',detail:'اختر نفسك أو اللاعب الأقل نقاطًا لبطاقة «حلّل». المجيب يربح 3 نقاط عند الإجابة المكتملة، دون حركة إضافية.',chips:['حلّل','المكافأة للمجيب']},
    duel:{title:'تحدي المنافسين',badge:'من يسبق إلى الإجابة؟',tone:'red',symbol:'duel',detail:'اختر منافسًا لبطاقة «اعرف» خلال 15 ثانية. أول إجابة صحيحة تكسب نقطة؛ أول إجابة خاطئة تنهي المواجهة.',chips:['اعرف · 15 ثانية','مكافأة نقطة']},
    arena:{title:'حلبة المناظرة',badge:'الخلية تجمع المنافسين',tone:'red',symbol:'duel',detail:'يشارك جميع اللاعبين الواقفين على الخلية في بطاقة «اعرف» خلال 15 ثانية. أول إجابة صحيحة تكسب نقطتين؛ أول إجابة خاطئة تنهي المناظرة.',chips:['جميع الواقفين على الخلية','مكافأة نقطتين']},
    team:{title:'خلية الفريق',badge:'معًا نحو الإجابة',tone:'green',symbol:'team',detail:'اختر زميلًا للإجابة معك. يحصل كل منكما على نقاط البطاقة كاملة، ويتحرك صاحب الدور فقط.',chips:['تعاون','مكافأة كاملة لكل مشارك']},
    streak:{title:'سلسلة الإتقان',badge:'واصل سلسلة نجاحك',tone:'green',symbol:'✓ ✓',detail:'إجابتان مكتملتان متتاليتان في الأسئلة العادية تمنحان 3 نقاط إضافية. تنتهي السلسلة عند الإجابة غير المكتملة.',chips:['نجاحان متتاليان','مكافأة 3 نقاط']}
  };
  const icons={shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z"/><path d="m8 12 3 3 5-6"/>',book:'<path d="M12 6C8 3 3 4 3 4v15s5-1 9 2c4-3 9-2 9-2V4s-5-1-9 2v15"/>',star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',duel:'<path d="m5 3 14 18M19 3 5 21M3 6l4-4M17 22l4-4M3 18l4 4M17 2l4 4"/>',team:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3M14 13a6 6 0 0 1 8 5v3"/>'};
  async function mount(panel,landing,actions,onNext){
    const meta=entries[landing.type]||entries.knowledge;
    panel.replaceChildren();const card=make('section','','cell-card cell-card-'+landing.type);card.dataset.cellType=landing.type;card.dataset.tone=meta.tone;
    const hero=make('div','','cell-card-hero'),badge=make('span',meta.badge,'cell-card-badge'),art=make('div','','cell-card-art');
    if(icons[meta.symbol]){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.6');svg.innerHTML=icons[meta.symbol];art.append(svg);}else art.textContent=meta.symbol;
    hero.append(badge,art,make('h2',meta.title));const body=make('div','','cell-card-body');
    body.append(make('p',landing.activated?'استخدمت محطة الأمان لحمايتك. يمكنك الآن إعادة السؤال نفسه.':meta.detail,'cell-card-description'));
    const chips=make('div','','cell-card-chips');for(const text of meta.chips)chips.append(make('span',text));body.append(chips);
    if(landing.type==='lamp'){const amount=window.MadaarGame.getState().boosts[landing.player]?.lamps||0;const balance=make('p','','cell-card-balance');balance.append(make('strong',String(amount)),make('span','مصابيح متاحة'));body.append(balance);}
    if(landing.type==='streak'){const steps=make('div','','cell-streak-progress');steps.append(make('span','1'),make('span','2'),make('strong','+3'));body.append(steps);}
    if(landing.type==='arena'){const names=make('div','','cell-card-participants');for(const player of landing.participants||[])names.append(make('span',window.MadaarGame.getState().names[player]));body.append(names);}
    if(landing.type==='knowledge')body.append(make('p','فَلَك يجهّز ومضة المعرفة…','cell-knowledge-flash'));
    const controls=make('div','','cell-card-actions');
    if(actions){for(const link of [...actions.children]){if(link.tagName!=='A')continue;link.classList.add('ai-submit');
      const query=new URL(link.href).searchParams;
      if(query.get('challenge')==='normal')link.textContent='متابعة بسؤال عادي';
      else if(query.has('target'))link.textContent=`ابدأ التحدي: ${window.MadaarGame.getState().names[Number(query.get('target'))]}`;
      else if(query.has('teamup'))link.textContent=`ابدأ التعاون مع ${window.MadaarGame.getState().names[Number(query.get('teamup'))]}`;
      else if(query.has('duel')&&!query.has('arena'))link.textContent=`ابدأ التحدي مع ${window.MadaarGame.getState().names[Number(query.get('duel'))]}`;
      else link.textContent='ابدأ التحدي';controls.append(link);}}
    else{const next=make('button','التالي','ai-submit cell-next');next.onclick=onNext;controls.append(next);}
    body.append(controls);card.append(hero,body);panel.append(card);
    if(landing.type==='knowledge'){
      const load=async()=>{try{const result=await window.MadaarAI.getKnowledge({...window.MadaarAI.context(),player:landing.player});if(!card.isConnected)return;card.querySelector('.cell-knowledge-flash').textContent=result.text;if(result.source?.label)body.insertBefore(make('p',result.source.label,'cell-card-source'),controls);}catch(error){if(!card.isConnected)return;const p=card.querySelector('.cell-knowledge-flash');p.textContent=error.message;const retry=make('button','إعادة المحاولة','ai-submit');retry.onclick=()=>{retry.remove();load();};body.insertBefore(retry,controls);}};load();
    }
  }
  window.MadaarCellCards={mount};
})();
