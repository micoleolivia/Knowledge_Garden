// ===================== KNOWLEDGE GARDEN — app.js =====================

const GARDEN_START = new Date('2026-06-10');

let currentPage = 1;
let unlockedCount = 0;
let activeBook = 'mix';
let activeEntries = [];

// ===================== DATE LOGIC =====================
function getDaysUnlocked(bookEntries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(GARDEN_START);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff + 1, 1), bookEntries.length);
}

// ===================== SHELF =====================
function goToShelf() {
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('book-view').classList.add('hidden');
  document.getElementById('shelf-view').classList.remove('hidden');
}

function pullBook(bookId) {
  activeBook = bookId;
  const spine = document.getElementById('book-' + bookId);
  spine.classList.add('pulling');
  setTimeout(() => {
    document.getElementById('shelf-view').classList.add('hidden');
    spine.classList.remove('pulling');
    enterGarden();
  }, 600);
}

// ===================== ENTER BOOK =====================
function enterGarden() {
  if (activeBook === 'finance') activeEntries = financeEntries;
  else if (activeBook === 'insects') activeEntries = insectEntries;
  else if (activeBook === 'history') activeEntries = historyEntries;
  else if (activeBook === 'words') activeEntries = wordsEntries;
  else activeEntries = entries;

  const bookNames = {
    mix: 'A Mix of Everything',
    finance: 'Financial Terms',
    insects: 'Insects of the World',
    history: 'History 101',
    words: 'Words Without Translation',
  };
  document.querySelector('.book-name').textContent = bookNames[activeBook];
  document.getElementById('book-view').classList.remove('hidden');

  unlockedCount = getDaysUnlocked(activeEntries);
  currentPage = unlockedCount;
  renderPage(currentPage);
  renderArchive();
  updateProgress();
}

function goToLanding() {
  document.getElementById('book-view').classList.add('hidden');
  document.getElementById('shelf-view').classList.add('hidden');
  document.getElementById('landing').classList.remove('hidden');
}

// ===================== RENDER PAGE =====================
function renderPage(dayNumber) {
  const entry = activeEntries.find(e => e.day === dayNumber);
  const page = document.getElementById('book-page');

  page.classList.remove('page-animate');
  void page.offsetWidth;
  page.classList.add('page-animate');

  if (!entry || dayNumber > unlockedCount) {
    page.innerHTML = `
      <div class="locked-overlay">
        <span class="locked-icon">🔒</span>
        <p class="locked-title">This page isn't ready yet.</p>
        <p class="locked-text">Come back tomorrow — a new entry unlocks every day.</p>
      </div>
    `;
    return;
  }

  document.getElementById('entry-category').textContent = entry.category;
  document.getElementById('entry-day').textContent = `Day ${entry.day} of ${activeEntries.length}`;
  document.getElementById('entry-title').textContent = entry.title;
  document.getElementById('entry-fun').textContent = entry.fun_fact;

  const examplesSection = document.getElementById('entry-examples-section');
  examplesSection.style.display = 'none';
  document.querySelector('.cocktail-section').style.display = 'block';

  if (activeBook === 'insects') {
    document.getElementById('entry-formal').textContent = entry.species;
    document.getElementById('entry-plain').textContent = entry.meet;
    document.getElementById('entry-why').textContent = entry.where;
    document.getElementById('entry-cocktail').textContent = entry.superpower;
    document.querySelector('[data-label="formal"]').textContent = '🔬 The Species';
    document.querySelector('[data-label="plain"]').textContent = '📖 Meet the Creature';
    document.querySelector('[data-label="why"]').textContent = '🌍 Where in the World';
    document.querySelector('[data-label="cocktail"]').textContent = '✨ Its Superpower';

  } else if (activeBook === 'history') {
    document.getElementById('entry-formal').textContent = entry.setting;
    document.getElementById('entry-plain').textContent = entry.what_happened;
    document.getElementById('entry-why').textContent = entry.why_matters;
    document.querySelector('[data-label="formal"]').textContent = '📅 The Setting';
    document.querySelector('[data-label="plain"]').textContent = '📖 What Happened';
    document.querySelector('[data-label="why"]').textContent = '🌍 Why It Still Matters';
    document.querySelector('.cocktail-section').style.display = 'none';

  } else if (activeBook === 'words') {
    document.getElementById('entry-formal').textContent = entry.language;
    document.getElementById('entry-plain').textContent = entry.meaning;
    document.getElementById('entry-why').textContent = entry.feeling;
    document.querySelector('[data-label="formal"]').textContent = '🌍 The Language';
    document.querySelector('[data-label="plain"]').textContent = '📖 What It Means';
    document.querySelector('[data-label="why"]').textContent = '💭 The Feeling';
    document.querySelector('.cocktail-section').style.display = 'none';

  } else {
    document.getElementById('entry-formal').textContent = entry.formal;
    document.getElementById('entry-plain').textContent = entry.plain;
    document.getElementById('entry-why').textContent = entry.why;
    document.getElementById('entry-cocktail').textContent = entry.cocktail;
    document.querySelector('[data-label="formal"]').textContent = '📖 The Definition';
    document.querySelector('[data-label="plain"]').textContent = '💬 In Plain English';
    document.querySelector('[data-label="why"]').textContent = '🌍 Why It Matters';
    document.querySelector('[data-label="cocktail"]').textContent = '🥂 The Cocktail Party Question';

    const examplesEl = document.getElementById('entry-examples');
    if (entry.examples && entry.examples.length) {
      examplesEl.innerHTML = entry.examples.map(e => `<p class="section-text" style="margin-bottom:0.8rem">${e}</p>`).join('');
      examplesSection.style.display = 'block';
    }
  }

  updateNavButtons();
  updateArchiveActive();
  updatePageIndicator();
}

// ===================== NAVIGATION =====================
function changePage(direction) {
  const newPage = currentPage + direction;
  if (newPage < 1 || newPage > unlockedCount) return;
  currentPage = newPage;
  renderPage(currentPage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavButtons() {
  document.getElementById('prev-btn').disabled = currentPage <= 1;
  document.getElementById('next-btn').disabled = currentPage >= unlockedCount;
}

function updatePageIndicator() {
  document.getElementById('page-indicator').textContent = `${currentPage} / ${unlockedCount}`;
}

// ===================== ARCHIVE =====================
function renderArchive() {
  const list = document.getElementById('archive-list');
  list.innerHTML = '';

  if (unlockedCount <= 1) {
    list.innerHTML = '<span style="font-size:0.8rem;font-style:italic;color:var(--ink-faint);">Previous entries will appear here as you go.</span>';
    return;
  }

  for (let i = unlockedCount; i >= 1; i--) {
    const entry = activeEntries.find(e => e.day === i);
    if (!entry) continue;
    const chip = document.createElement('button');
    chip.className = 'archive-chip' + (i === currentPage ? ' active' : '');
    chip.textContent = entry.title;
    chip.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
      updateArchiveActive();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    list.appendChild(chip);
  }
}

function updateArchiveActive() {
  document.querySelectorAll('.archive-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  const chips = document.querySelectorAll('.archive-chip');
  chips.forEach((chip, i) => {
    const day = unlockedCount - i;
    if (day === currentPage) chip.classList.add('active');
  });
}

// ===================== PROGRESS =====================
function updateProgress() {
  document.getElementById('progress-label').textContent = `${unlockedCount} / ${activeEntries.length} pages`;
}

// ===================== PAGE ANIMATION =====================
const style = document.createElement('style');
style.textContent = `
  .page-animate {
    animation: pageIn 0.35s ease forwards;
  }
  @keyframes pageIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
