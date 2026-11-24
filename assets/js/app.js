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
