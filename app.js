// ===================== KNOWLEDGE GARDEN — app.js =====================

// The garden starts on this date — change this to your actual launch date!
const GARDEN_START = new Date('2026-06-10');

let currentPage = 1;
let unlockedCount = 0;

// ===================== DATE LOGIC =====================
function getDaysUnlocked() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(GARDEN_START);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff + 1, 1), entries.length);
}

// ===================== LANDING =====================
function enterGarden() {
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('book-view').classList.remove('hidden');

  unlockedCount = getDaysUnlocked();
  currentPage = unlockedCount; // open to today's page by default
  renderPage(currentPage);
  renderArchive();
  updateProgress();
}

function goToLanding() {
  document.getElementById('book-view').classList.add('hidden');
  document.getElementById('landing').classList.remove('hidden');
}

// ===================== RENDER PAGE =====================
function renderPage(dayNumber) {
  const entry = entries.find(e => e.day === dayNumber);
  const page = document.getElementById('book-page');

  page.classList.remove('page-animate');
  void page.offsetWidth; // force reflow
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
  document.getElementById('entry-day').textContent = `Day ${entry.day} of 60`;
  document.getElementById('entry-title').textContent = entry.title;
  document.getElementById('entry-formal').textContent = entry.formal;
  document.getElementById('entry-plain').textContent = entry.plain;
  document.getElementById('entry-why').textContent = entry.why;
  document.getElementById('entry-cocktail').textContent = entry.cocktail;
  document.getElementById('entry-fun').textContent = entry.fun_fact;
  document.getElementById('entry-closing').textContent = entry.formal;

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

  // Show all unlocked entries except current, most recent first
  for (let i = unlockedCount; i >= 1; i--) {
    const entry = entries.find(e => e.day === i);
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
  // chips are rendered newest-first, so day = unlockedCount - index
  chips.forEach((chip, i) => {
    const day = unlockedCount - i;
    if (day === currentPage) chip.classList.add('active');
  });
}

// ===================== PROGRESS =====================
function updateProgress() {
  document.getElementById('progress-label').textContent = `${unlockedCount} / 60 pages`;
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
