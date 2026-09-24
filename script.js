// script.js — contador + smooth scroll + highlight de sección en nav
// + inicialización de barras de "Goles" (se calculan según data-goals)
(function(){
  // --- Contador ---
  const matchDate = new Date('2026-09-22T14:20:00'); // ajustar si se desea
  const pillText = document.getElementById('pill-text');
  const nextMatchText = document.querySelector('.next-match');
  const countPill = document.getElementById('count-pill');

  function pad(n){ return String(n).padStart(2,'0'); }

  function updateCountdown(){
    const now = new Date();
    let diff = matchDate - now;
    if (diff <= 0){
      if(pillText) pillText.textContent = '0 DÍAS 00:00:00 para el próximo partido';
      if(nextMatchText) nextMatchText.textContent = 'Próximo partido: Día del partido';
      if(countPill) countPill.classList.remove('active');
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const minutes = Math.floor(diff / (1000*60));
    diff -= minutes * (1000*60);
    const seconds = Math.floor(diff / 1000);

    if(pillText) pillText.textContent = `${days} DÍAS ${pad(hours)}:${pad(minutes)}:${pad(seconds)} para el próximo partido`;
    if(nextMatchText) nextMatchText.innerHTML = 'Próximo partido: <strong>22 de septiembre de 2026</strong>';
    if(countPill) countPill.classList.add('active');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('.main-nav a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
      }
    });
  });

  // --- Active nav item while scrolling (IntersectionObserver) ---
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  if(sections.length && navLinks.length){
    const obsOptions = { root: null, rootMargin: '-30% 0px -40% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = entry.target.id;
          navLinks.forEach(l=>{
            if(l.getAttribute('href') === '#'+id){
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });
        }
      });
    }, obsOptions);
    sections.forEach(s => observer.observe(s));
  }

  // --- Scroll hint behavior (focus content) ---
  document.querySelectorAll('.scroll-hint').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = document.querySelector(el.getAttribute('href'));
      if(target){
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 84, behavior:'smooth' });
        target.focus({preventScroll:true});
      }
    });
  });

  // --- Inicializar barras en "Goles" ---
  function initGoalBars(){
    const goalItems = Array.from(document.querySelectorAll('.goal-item'));
    if(goalItems.length === 0) return;
    const values = goalItems.map(it => {
      const v = parseInt(it.getAttribute('data-goals') || '0', 10);
      return isNaN(v) ? 0 : v;
    });
    const max = Math.max(...values, 1);
    goalItems.forEach(it => {
      const v = parseInt(it.getAttribute('data-goals') || '0', 10) || 0;
      const pct = Math.round((v / max) * 100);
      const bar = it.querySelector('.goal-bar');
      if(bar){
        setTimeout(()=> {
          bar.style.width = pct + '%';
        }, 120);
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initGoalBars);
  } else {
    initGoalBars();
  }
})();
