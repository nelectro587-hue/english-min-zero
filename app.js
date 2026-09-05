const lessons=[
 {title:"التحيات",words:[["Hello","مرحبًا"],["Good morning","صباح الخير"],["Good evening","مساء الخير"],["Goodbye","إلى اللقاء"]],q:"كيف تقول «مرحبًا» بالإنجليزية؟",a:["Hello","Thanks","Goodbye"],correct:0},
 {title:"التعريف بالنفس",words:[["My name is...","اسمي هو..."],["I am","أنا"],["Nice to meet you","سعيد بلقائك"],["I am from Morocco","أنا من المغرب"]],q:"ما معنى My name is Ali؟",a:["اسمي علي","أنا بخير","إلى اللقاء"],correct:0},
 {title:"الأرقام",words:[["One","واحد"],["Two","اثنان"],["Three","ثلاثة"],["Ten","عشرة"]],q:"ما معنى Three؟",a:["اثنان","ثلاثة","عشرة"],correct:1},
 {title:"الألوان",words:[["Red","أحمر"],["Blue","أزرق"],["Green","أخضر"],["Black","أسود"]],q:"ما معنى Blue؟",a:["أزرق","أحمر","أسود"],correct:0},
 {title:"العائلة",words:[["Father","الأب"],["Mother","الأم"],["Brother","الأخ"],["Sister","الأخت"]],q:"ما معنى Mother؟",a:["الأخت","الأم","الأب"],correct:1},
 {title:"أيام الأسبوع",words:[["Monday","الاثنين"],["Tuesday","الثلاثاء"],["Friday","الجمعة"],["Sunday","الأحد"]],q:"ما معنى Friday؟",a:["الجمعة","الأحد","الثلاثاء"],correct:0},
 {title:"الأفعال الأساسية",words:[["Go","يذهب"],["Come","يأتي"],["Eat","يأكل"],["Drink","يشرب"]],q:"ما معنى Eat؟",a:["يشرب","يأكل","يذهب"],correct:1},
 {title:"في المنزل",words:[["House","منزل"],["Room","غرفة"],["Door","باب"],["Window","نافذة"]],q:"ما معنى Door؟",a:["نافذة","باب","غرفة"],correct:1},
 {title:"الطعام",words:[["Water","ماء"],["Bread","خبز"],["Milk","حليب"],["Apple","تفاحة"]],q:"ما معنى Water؟",a:["ماء","حليب","خبز"],correct:0},
 {title:"جمل يومية",words:[["How are you?","كيف حالك؟"],["I'm fine","أنا بخير"],["Thank you","شكرًا لك"],["See you","أراك لاحقًا"]],q:"كيف تقول «أنا بخير»؟",a:["I'm fine","Thank you","See you"],correct:0}
];

let state=JSON.parse(localStorage.getItem("englishZero")||'{"done":[],"points":0}');
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("englishZero",JSON.stringify(state));updateHome()}
function updateHome(){
 const pct=Math.round(state.done.length/lessons.length*100);
 $("progressPct").textContent=pct+"%";
 document.querySelector(".progress-ring").style.setProperty("--deg",(pct*3.6)+"deg");
 $("lessonCount").textContent=`أكملت ${state.done.length} من ${lessons.length} دروس`;
 $("points").textContent=state.points;
 $("lastLesson").textContent=lessons[Math.min(state.done.length,lessons.length-1)].title;
}
function openModal(html){$("modalContent").innerHTML=html;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
$("closeModal").onclick=closeModal;
$("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};

function showLessons(){
 let html="<h2>📚 الدروس</h2><p class='muted'>اختر درسًا وابدأ التعلم.</p>";
 lessons.forEach((l,i)=>{
  const done=state.done.includes(i);
  html+=`<div class="lesson"><h3>${done?"✅ ":""}الدرس ${i+1}: ${l.title}</h3><p class="muted">${l.words.length} كلمات + تمرين</p><button class="primary" onclick="openLesson(${i})">${done?"مراجعة":"ابدأ الدرس"}</button></div>`;
 });
 openModal(html)
}
window.openLesson=function(i){
 const l=lessons[i];
 let html=`<h2>📖 الدرس ${i+1}: ${l.title}</h2>`;
 html+=l.words.map(w=>`<div class="lesson"><b>${w[0]}</b><br><span class="muted">${w[1]}</span> 🔊</div>`).join("");
 html+=`<hr><h3>اختبر نفسك</h3><p>${l.q}</p>`;
 l.a.forEach((x,j)=>html+=`<button class="answer" onclick="answer(${i},${j},this)">${x}</button>`);
 openModal(html)
}
window.answer=function(i,j,el){
 document.querySelectorAll(".answer").forEach(x=>x.disabled=true);
 const correct=j===lessons[i].correct;
 el.classList.add(correct?"correct":"wrong");
 if(correct && !state.done.includes(i)){state.done.push(i);state.points+=100;save();setTimeout(()=>{openLesson(i)},500)}
 else if(!correct){state.points=Math.max(0,state.points-10);save()}
}
function showQuiz(){
 let i=state.done.length<lessons.length?state.done.length:0;
 openLesson(i)
}
function showSimple(title,body){openModal(`<h2>${title}</h2><p class="muted">${body}</p>`)}
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{
 const tab=b.dataset.tab;
 if(tab==="lessons"||tab==="levels")showLessons();
 else if(tab==="quiz")showQuiz();
 else if(tab==="words")showSimple("🔤 الكلمات","ستجد هنا كلمات الدروس مع ترجمتها ونطقها. هذه النسخة الأولى جاهزة للتوسعة.");
 else if(tab==="grammar")showSimple("📖 القواعد","سنضيف القواعد تدريجيًا من الجمل البسيطة إلى الأزمنة الأساسية.");
 else if(tab==="conversation")showSimple("🗣️ المحادثة","مواقف عملية: التعارف، المطعم، المتجر، المطار والعمل.");
 else if(tab==="listening")showSimple("🎧 الاستماع","سنضيف مقاطع صوتية قصيرة مع أسئلة للفهم.");
 else if(tab==="challenge")showSimple("🏆 التحديات",`رصيدك الحالي: ${state.points} نقطة. أكمل الدروس للحصول على 100 نقطة لكل درس.`);
 else if(tab==="progress")showSimple("📈 تقدمي",`أكملت ${state.done.length} من ${lessons.length} دروس (${Math.round(state.done.length/lessons.length*100)}%).`);
 else if(tab==="points")showSimple("⭐ النقاط",`لديك ${state.points} نقطة.`);
 else if(tab==="favorites")showSimple("♥ المفضلة","لم تضف دروسًا إلى المفضلة بعد.");
 else if(tab==="profile")showSimple("● ملفي","يمكننا لاحقًا إضافة الحساب، الصورة، الإحصاءات والإعدادات.");
 else if(tab==="home")closeModal();
});
$("continueBtn").onclick=()=>openLesson(Math.min(state.done.length,lessons.length-1));
$("premiumBtn").onclick=()=>showSimple("👑 Premium","هنا سنضع لاحقًا الاشتراك المدفوع وإزالة الإعلانات وفتح المحتوى الإضافي.");
$("menuBtn").onclick=()=>showSimple("☰ القائمة","English من الصفر — النسخة التجريبية الأولى");
$("notifyBtn").onclick=()=>showSimple("🔔 الإشعارات","لا توجد إشعارات جديدة.");
updateHome();
if ("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
