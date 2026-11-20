/* CUSTOM CURSOR */
const cx = document.getElementById('cx');
const cr = document.getElementById('cr');
let mx=window.innerWidth/2, my=window.innerHeight/2;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cx.style.left=mx+'px'; cx.style.top=my+'px';
  cr.style.left=mx+'px'; cr.style.top=my+'px';
});

/* BACKGROUND CANVAS — grid + nodes */
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
resize(); window.addEventListener('resize', resize);

const NODES = Array.from({length:60},()=>({
  x:Math.random()*canvas.width, y:Math.random()*canvas.height,
  vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
  r:Math.random()*1.6+.6
}));

function drawFrame(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  /* faint grid */
  ctx.strokeStyle='rgba(0,238,255,.025)'; ctx.lineWidth=1;
  const gs=60;
  for(let x=0;x<canvas.width;x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=0;y<canvas.height;y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  /* nodes */
  NODES.forEach((a,i)=>{
    a.x+=a.vx; a.y+=a.vy;
    if(a.x<0||a.x>canvas.width) a.vx*=-1;
    if(a.y<0||a.y>canvas.height) a.vy*=-1;
    NODES.slice(i+1).forEach(b=>{
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<155){
        ctx.beginPath();
        ctx.strokeStyle=`rgba(0,238,255,${(1-d/155)*.22})`;
        ctx.lineWidth=.6;
        ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    });
    ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
    ctx.fillStyle='rgba(0,238,255,.45)'; ctx.fill();
  });
  requestAnimationFrame(drawFrame);
}
drawFrame();

/* SCROLL REVEAL */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on'); });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* SKILL BARS */
const barObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)
      e.target.querySelectorAll('.bar-fill').forEach(b=>{ b.style.width=b.dataset.w+'%'; });
  });
},{threshold:.25});
document.querySelectorAll('.skill-card').forEach(c=>barObs.observe(c));

/* ACTIVE NAV */
const sections = [...document.querySelectorAll('section[id]')];
const navAs = [...document.querySelectorAll('.nav-links a')];
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-140) cur=s.id; });
  navAs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
});

/* PHOTO UPLOAD */
const fileInp = document.getElementById('file-inp');
fileInp.addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    const src = ev.target.result;
    // Hero photo
    const ph = document.getElementById('photo-ph');
    if(ph){
      const img = document.createElement('img');
      img.src=src; img.alt='Photo de profil';
      ph.replaceWith(img);
    }
    // Footer avatar
    const fap = document.getElementById('f-avatar-ph');
    if(fap) fap.innerHTML=`<img src="${src}" alt="Ouattara Abou" style="width:100%;height:100%;object-fit:cover;filter:grayscale(15%);"/>`;
  };
  reader.readAsDataURL(f);
  e.target.value='';
});

/* ENVOI DU FORMULAIRE VERS WHATSAPP */
const WHATSAPP_NUMBER = '2250556446101'; // 225 (Côte d'Ivoire) + 0556446101
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

contactForm.addEventListener('submit', event => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const text = [
    'Bonjour Abou, je vous contacte depuis votre portfolio.',
    '',
    'Nom : ' + data.get('name'),
    'Email : ' + data.get('email'),
    'Objet : ' + data.get('subject'),
    '',
    'Message : ' + data.get('message')
  ].join('\n');

  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  window.open(url, '_blank', 'noopener');

  contactStatus.className = 'form-status is-success';
  contactStatus.textContent = 'WhatsApp s’ouvre : appuyez sur « Envoyer » pour transmettre votre message.';
  contactForm.reset();
});
