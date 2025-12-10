// Theme toggle
(function(){
  const root = document.documentElement;
  const stored = localStorage.getItem('site-theme');
  if (stored === 'dark') document.body.classList.add('theme-dark');
  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    const nowDark = document.body.classList.contains('theme-dark');
    localStorage.setItem('site-theme', nowDark ? 'dark' : 'light');
  });
})();

// Playground logic
(function(){
  const htmlEditor = document.getElementById('htmlEditor');
  const cssEditor = document.getElementById('cssEditor');
  const jsEditor = document.getElementById('jsEditor');
  const runBtn = document.getElementById('runBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const preview = document.getElementById('previewFrame');
  const autoRunToggle = document.getElementById('autoRunToggle');
  const previewState = document.getElementById('previewState');
  let autoRun = true;
  let timeout = null;

  function buildSource(){
    const html = htmlEditor.value;
    const css = `<style>${cssEditor.value}</style>`;
    const js = `<script>try{${jsEditor.value}}catch(e){console.error(e)}<\/script>`;
    return html.replace('</head>', css + '</head>') + js;
  }

  function setPreview(src){
    preview.srcdoc = src;
    previewState.textContent = 'Updated ' + new Date().toLocaleTimeString();
  }

  function run(){
    setPreview(buildSource());
  }

  runBtn.addEventListener('click', run);

  autoRunToggle.addEventListener('click', () => {
    autoRun = !autoRun;
    autoRunToggle.setAttribute('aria-pressed', autoRun ? 'true' : 'false');
    autoRunToggle.classList.toggle('active');
  });

  [htmlEditor, cssEditor, jsEditor].forEach(el => {
    el.addEventListener('input', () => {
      if (!autoRun) return;
      clearTimeout(timeout);
      timeout = setTimeout(run, 500);
    });
  });

  // keyboard shortcut: Ctrl/Cmd + Enter
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  });

  // download combined HTML
  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([buildSource()], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-export.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // reset to defaults
  const clearBtn = document.getElementById('clearBtn');
  clearBtn.addEventListener('click', () => {
    htmlEditor.value = '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Example</title>\n  </head>\n  <body>\n    <h2>Hello from the playground</h2>\n    <div id="app"></div>\n  </body>\n</html>';
    cssEditor.value = 'body{font-family:system-ui, -apple-system, sans-serif;margin:16px}h2{color:#0b5;}';
    jsEditor.value = "document.getElementById('app').innerHTML = '<p>Rendered with JS</p>';";
    run();
  });

  // initial run
  run();

  // small optimization: observe visibility and pause auto-run when preview not visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (!ent.isIntersecting) {
        previewState.textContent = 'Preview paused (not visible)';
      } else {
        previewState.textContent = 'Preview ready';
      }
    });
  });
  observer.observe(preview);
})();