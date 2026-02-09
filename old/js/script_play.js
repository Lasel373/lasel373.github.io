// Navigation toggle for small screens
(function(){
  const btn = document.getElementById('menuToggle');
  const nav = document.querySelector('.links');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? '' : 'flex';
  });
})();

// Simple canvas background — floating particles
(function(){
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize(){
    w = canvas.width = Math.round(canvas.clientWidth * devicePixelRatio);
    h = canvas.height = Math.round(canvas.clientHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  function initParticles(n=24){
    particles = Array.from({length:n}).map(()=>({
      x: Math.random()*canvas.clientWidth,
      y: Math.random()*canvas.clientHeight,
      r: 6 + Math.random()*20,
      vx: (Math.random()-0.5)*0.2,
      vy: (Math.random()-0.5)*0.2,
      hue: 180 + Math.random()*140
    }));
  }

  function draw(){
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if (p.x < -50) p.x = canvas.clientWidth + 50;
      if (p.x > canvas.clientWidth + 50) p.x = -50;
      if (p.y < -50) p.y = canvas.clientHeight + 50;
      if (p.y > canvas.clientHeight + 50) p.y = -50;

      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      g.addColorStop(0, `hsla(${p.hue},75%,65%,0.18)`);
      g.addColorStop(1, `hsla(${p.hue},75%,55%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  function start(){
    resize();
    initParticles(24);
    draw();
  }

  window.addEventListener('resize', () => { clearTimeout(window._bgResize); window._bgResize = setTimeout(resize, 120); });
  start();
})();

// Reveal on scroll
(function(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) e.target.classList.add('inview');
    });
  }, {threshold: 0.15});
  document.querySelectorAll('.card, .feature, .snippet').forEach(el=>observer.observe(el));
})();

// Small helper: allow embedding small code-run sections by author editing the HTML
// (No automatic editor included — add markup into the .stage section.)