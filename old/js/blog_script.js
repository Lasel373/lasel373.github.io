let postsData = [];
let grid, searchInput, sortSelect, matchCount;
let activeTags = new Set();

// JSON-Datei laden
fetch('../pages/posts/posts.json')
  .then(res => res.json())
  .then(data => {
    postsData = data;   // postsData initialisieren
    setupTagsAndUpdate(); // Tags erstellen und Seite aktualisieren
  })
  .catch(err => console.error('Fehler beim Laden der Posts:', err));

function normalize(s){return (s||'').toString().toLowerCase().trim();}

function update(){
  // normalize and split query tokens
  let raw = normalize(searchInput.value);
  const tokens = raw.split(/\s+/).filter(Boolean);

  // secret token handling: if 'broken' appears anywhere, enable WIP view
  const secretToken = 'broken';
  const hasSecret = tokens.includes(secretToken);

  // remove secret token from the query used for text-matching
  const qTokens = tokens.filter(t=>t !== secretToken);
  const q = qTokens.join(' '); // may be empty if user only typed 'broken'

  const tags = Array.from(activeTags);

  let filtered = postsData.filter(p=>{
    const tagsLower = (p.tags||[]).map(t=>t.toString().toLowerCase());
    const isWip = tagsLower.includes('wip');

    // hide WIP posts unless secret token provided
    if(isWip && !hasSecret) return false;

    // tag chips filter (applies to all posts including WIP when visible)
    if(tags.length>0 && !(p.tags||[]).some(t=>tags.includes(t))) return false;

    // text search: if there's a remaining query (after removing 'broken'), apply it
    if(q.length>0){
      const hay = normalize(p.title + ' ' + (p.excerpt||'') + ' ' + (p.tags||[]).join(' '));
      if(!hay.includes(q)) return false;
    }

    return true;
  });

  const s = sortSelect.value;
  filtered.sort((a,b)=>{
    if(s==='date-desc') return new Date(b.date) - new Date(a.date);
    if(s==='date-asc') return new Date(a.date) - new Date(b.date);
    if(s==='title-asc') return a.title.localeCompare(b.title, 'de');
    if(s==='title-desc') return b.title.localeCompare(a.title, 'de');
    return 0;
  });

  render(filtered);
}

function render(list){
  grid.innerHTML = '';
  if(list.length===0){grid.innerHTML = '<div class="small">Keine Beiträge gefunden.</div>'; matchCount.textContent='0'; return}
  matchCount.textContent = list.length;
  const frag = document.createDocumentFragment();
  list.forEach(p=>{
    const item = document.createElement('article');
    item.className = 'card';
    item.setAttribute('role','listitem');

    const img = document.createElement('img');
    img.loading='lazy';
    img.alt = p.title + ' — Vorschaubild';
    img.src = p.image || '';
    img.onerror = ()=>{ img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520"><rect width="100%" height="100%" fill="%230b1220"/><text x="50%" y="50%" fill="%239aa4b2" font-size="20" font-family="Arial" text-anchor="middle" dy="6">Kein Bild</text></svg>' }

    const body = document.createElement('div'); body.className='card-body';
    const h3 = document.createElement('h3');
    const a = document.createElement('a'); a.href = p.link; a.className='title-link'; a.textContent = p.title; a.setAttribute('aria-label', p.title + ', Beitrag öffnen');
    h3.appendChild(a);

    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = new Date(p.date).toLocaleDateString('de-DE');

    const excerpt = document.createElement('div'); excerpt.className='excerpt'; excerpt.textContent = p.excerpt || '';

    const taglist = document.createElement('div'); taglist.className='taglist';
    (p.tags||[]).slice(0,4).forEach(t=>{const span=document.createElement('span');span.className='tag';span.textContent=t;taglist.appendChild(span)});

    body.appendChild(h3); body.appendChild(meta); body.appendChild(excerpt); body.appendChild(taglist);

    item.appendChild(img); item.appendChild(body);
    frag.appendChild(item);
  });
  grid.appendChild(frag);
}

function debounce(fn, wait=200){let t;return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),wait)}}

function setupTagsAndUpdate() {
  // Tags
  grid = document.getElementById('posts-grid');
  searchInput = document.getElementById('search');
  sortSelect = document.getElementById('sort');
  matchCount = document.getElementById('match-count');

  const tagContainer = document.getElementById('tag-chips');
  const allTags = [...new Set(postsData.flatMap(p => p.tags || [])
    .filter(t => t && t.toString().toLowerCase() !== 'wip'))]
    .sort((a, b) => a.localeCompare(b,'de'));

  activeTags = new Set(); // jetzt global sichtbar

  function createChip(tag) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = tag;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        activeTags.add(tag);
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
      update();
    });
    return btn;
  }

  allTags.forEach(t => tagContainer.appendChild(createChip(t)));

  // Event Listener
  searchInput.addEventListener('input', debounce(update, 160));
  sortSelect.addEventListener('change', update);

  update(); // initiales Rendern
}