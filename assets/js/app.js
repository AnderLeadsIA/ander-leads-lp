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

// Automatic carousel with explicit pause, keyboard controls and touch swipe.
const bobCarousel = document.querySelector('.bob-carousel');
if (bobCarousel) {
  const slides = [...bobCarousel.querySelectorAll('.bob-slide')];
  const tabs = [...bobCarousel.querySelectorAll('[data-slide]')];
  const controls = bobCarousel.querySelector('.carousel-controls');
  const status = bobCarousel.querySelector('.carousel-status');
  const toggle = bobCarousel.querySelector('[data-carousel-toggle]');
  const labels = ['BOB CRM', 'BOB INSTA', 'Avaliações no Google — em implementação'];
  let activeSlide = 0;
  let timer;
  let playing = !motionPreference.matches;
  let hovering = false;
  let focused = false;
  let touching = false;
  let inView = !('IntersectionObserver' in window);

  function syncPlayback() {
    clearTimeout(timer);
    toggle.textContent = playing ? 'Pausar' : 'Reproduzir';
    toggle.setAttribute('aria-label', playing ? 'Pausar troca automática' : 'Iniciar troca automática');
    const running = playing && !hovering && !focused && !touching && inView && !document.hidden;
    status.setAttribute('aria-live', running ? 'off' : 'polite');
    if (running) timer = setTimeout(() => showBobSlide(activeSlide + 1), 8000);
  }
  function showBobSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== activeSlide;
      slide.classList.toggle('carousel-enter', i === activeSlide);
    });
    tabs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeSlide)));
    status.textContent = `${activeSlide + 1} de ${slides.length} — ${labels[activeSlide]}`;
    syncPlayback();
  }
  function selectManually(index) {
    playing = false;
    showBobSlide(index);
  }
  controls.hidden = false;
  status.hidden = false;
  showBobSlide(0);
  tabs.forEach((button, i) => button.addEventListener('click', () => selectManually(i)));
  bobCarousel.querySelector('[data-carousel-prev]').addEventListener('click', () => selectManually(activeSlide - 1));
  bobCarousel.querySelector('[data-carousel-next]').addEventListener('click', () => selectManually(activeSlide + 1));
  toggle.addEventListener('click', () => { playing = !playing; syncPlayback(); });
  bobCarousel.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovering = true; syncPlayback(); }
  });
  bobCarousel.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') { hovering = false; syncPlayback(); }
  });
  bobCarousel.addEventListener('focusin', () => { focused = true; syncPlayback(); });
  bobCarousel.addEventListener('focusout', event => {
    if (!bobCarousel.contains(event.relatedTarget)) { focused = false; syncPlayback(); }
  });
  document.addEventListener('visibilitychange', syncPlayback);
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) playing = false;
    syncPlayback();
  });
  if ('IntersectionObserver' in window) {
    const playbackObserver = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    playbackObserver.observe(bobCarousel);
  }
  controls.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = activeSlide + 1;
    else if (event.key === 'ArrowLeft') next = activeSlide - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = slides.length - 1;
    else return;
    event.preventDefault();
    selectManually(next);
    tabs[activeSlide].focus();
  });
  let touchStart;
  const slideArea = bobCarousel.querySelector('.carousel-slides');
  slideArea.addEventListener('touchstart', event => {
    touching = true;
    syncPlayback();
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  slideArea.addEventListener('touchend', event => {
    if (touchStart && event.changedTouches.length) {
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) selectManually(activeSlide + (dx < 0 ? 1 : -1));
    }
    touching = false;
    touchStart = null;
    syncPlayback();
  }, { passive: true });
  slideArea.addEventListener('touchcancel', () => {
    touching = false;
    touchStart = null;
    syncPlayback();
  }, { passive: true });
}
