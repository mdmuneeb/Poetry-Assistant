const vowels = 'aeiouy';
let rhymeMap = new Map();

// Dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Load word list after DOM is ready
  fetch('wordlist.txt')
    .then(res => res.text())
    .then(data => {
      const wordList = data.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean);
      buildRhymeMap(wordList);
    });
});

// Build rhyme map
function buildRhymeMap(words, suffixLength = 3) {
  words.forEach(word => {
    const reversed = word.split('').reverse().join('');
    const suffix = reversed.substring(0, suffixLength);
    if (!rhymeMap.has(suffix)) rhymeMap.set(suffix, []);
    rhymeMap.get(suffix).push(word);
  });
}

// Find rhyming words
function findRhymes() {
  const word = document.getElementById('rhymeInput').value.toLowerCase().trim();
  const output = document.getElementById('rhymeOutput');
  const reversed = word.split('').reverse().join('');
  const suffix = reversed.substring(0, 3);
  const results = rhymeMap.get(suffix) || [];
  output.innerHTML = results.length
    ? `<b>Rhymes for "${word}":</b><ul>${results.filter(w => w !== word).slice(0, 20).map(w => `<li>${w}</li>`).join('')}</ul>`
    : `No rhymes found for "${word}".`;
}

// Count syllables in a line
function countSyllables(line) {
  let total = 0;
  const words = line.toLowerCase().split(/\s+/);
  words.forEach(word => {
    let syllables = 0;
    let prevVowel = false;
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevVowel) {
        syllables++;
        prevVowel = true;
      } else if (!isVowel) {
        prevVowel = false;
      }
    }
    if (word.endsWith('e')) syllables = Math.max(syllables - 1, 1);
    total += syllables;
  });
  return total;
}

// Analyze metre
function analyzeMetre() {
  const line = document.getElementById('metreInput').value;
  const output = document.getElementById('metreOutput');
  const count = countSyllables(line);
  output.innerHTML = `Syllable count: <b>${count}</b>`;
}

// Group by starting letter
function groupAlliteration(line) {
  const map = new Map();
  const words = line.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  words.forEach(word => {
    const start = word[0];
    if (!map.has(start)) map.set(start, []);
    map.get(start).push(word);
  });
  return map;
}

// Check alliteration
function checkAlliteration() {
  const line = document.getElementById('alliterationInput').value;
  const output = document.getElementById('alliterationOutput');
  const groups = groupAlliteration(line);
  const repeated = Array.from(groups.entries()).filter(([_, words]) => words.length > 1);
  output.innerHTML = repeated.length
    ? `<b>Alliteration detected:</b><ul>${repeated.map(([ch, w]) => `<li>${ch.toUpperCase()}: ${w.join(', ')}</li>`).join('')}</ul>`
    : `No alliteration detected.`;
}
