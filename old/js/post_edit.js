const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const postContent = document.getElementById('post-content');

let editing = false;
let textarea;

editBtn.addEventListener('click', () => {
  if (!editing) {
    editing = true;
    textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '400px';
    textarea.value = postContent.innerHTML.trim();
    postContent.innerHTML = '';
    postContent.appendChild(textarea);

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
  }
});

saveBtn.addEventListener('click', async () => {
  const content = textarea.value;
  const filename = document.body.dataset.filename;

  const res = await fetch('/pages/posts/save_post.php', { 
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ filename, content })
  });

  console.log(res); // Prüfen, ob überhaupt eine Antwort kommt
  const result = await res.json();
  console.log(result); // Prüfen, was PHP zurückgibt

  const result2 = await res.json();
  if (result2.status === 'ok') {
    postContent.innerHTML = content;
    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline-block';
    editing = false;
    textarea = null;
  } else {
    alert('Fehler beim Speichern');
  }
});

