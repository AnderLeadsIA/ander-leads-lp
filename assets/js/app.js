const messages={presenca:'Olá, Ander! Quero saber mais sobre o plano Presença Digital de R$ 350/mês.',captacao:'Olá, Ander! Quero saber mais sobre o plano Captação de R$ 500/mês.',completo:'Olá, Ander! Quero saber mais sobre o plano Marketing Completo de R$ 700/mês.'};
const defaultMessage='Olá, Ander! Vi os planos da AnderLeads.IA e quero saber qual é o melhor para minha empresa.';
document.querySelectorAll('[data-wa]').forEach(link=>{const source=link.dataset.wa;link.href=`https://wa.me/${window.SITE_CONFIG.whatsapp}?text=${encodeURIComponent(messages[source]||defaultMessage)}`;link.target='_blank';link.rel='noopener noreferrer';link.addEventListener('click',()=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'whatsapp_click',whatsapp_source:source,plan:messages[source]?source:null});});});
document.getElementById('year').textContent=new Date().getFullYear();
const privacy=document.getElementById('privacy');document.getElementById('privacy-open').addEventListener('click',()=>privacy.showModal());privacy.addEventListener('click',event=>{if(event.target===privacy){const r=privacy.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)privacy.close();}});

// Reveal each block once; the page stays visible without JS or motion support.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.hero-grid > *, .section-heading, .plan, .steps > div, .crm-grid > *, .about-grid > *, .contact .wrap, .audience .wrap');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  targets.forEach(target => {
    // Animate below-fold blocks only; keep the first screen immediately visible.
    if (target.getBoundingClientRect().top >= window.innerHeight) {
      target.classList.add('reveal', 'reveal-pending');
      observer.observe(target);
    }
  });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      observer.disconnect();
      targets.forEach(target => target.classList.remove('reveal-pending'));
    }
  });
}

// Manual carousel: keyboard, touch swipe, and explicit controls; no auto-play.
const bobCarousel = document.querySelector('.bob-carousel');
if (bobCarousel) {
  const slides = [...bobCarousel.querySelectorAll('.bob-slide')];
  const tabs = [...bobCarousel.querySelectorAll('[data-slide]')];
  const controls = bobCarousel.querySelector('.carousel-controls');
  const status = bobCarousel.querySelector('.carousel-status');
  const labels = ['BOB CRM', 'BOB INSTA', 'Avaliações no Google — em implementação'];
  let activeSlide = 0;
  function showBobSlide(index, announce = true) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== activeSlide;
      slide.classList.toggle('carousel-enter', i === activeSlide);
    });
    tabs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeSlide)));
    if (announce) status.textContent = `${activeSlide + 1} de ${slides.length} — ${labels[activeSlide]}`;
  }
  controls.hidden = false;
  status.hidden = false;
  showBobSlide(0, false);
  tabs.forEach((button, i) => button.addEventListener('click', () => showBobSlide(i)));
  bobCarousel.querySelector('[data-carousel-prev]').addEventListener('click', () => showBobSlide(activeSlide - 1));
  bobCarousel.querySelector('[data-carousel-next]').addEventListener('click', () => showBobSlide(activeSlide + 1));
  controls.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = activeSlide + 1;
    else if (event.key === 'ArrowLeft') next = activeSlide - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = slides.length - 1;
    else return;
    event.preventDefault();
    showBobSlide(next);
    tabs[activeSlide].focus();
  });
  let touchStart;
  bobCarousel.querySelector('.carousel-slides').addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  bobCarousel.querySelector('.carousel-slides').addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showBobSlide(activeSlide + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
}
