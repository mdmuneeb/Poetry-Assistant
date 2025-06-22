const vowels = 'aeiouy';
let rhymeMap = new Map();

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Load word list
  fetch('wordlist.txt')
    .then(res => res.text())
    .then(data => {
      const wordList = data.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean);
      buildRhymeMap(wordList);
      window.wordList = wordList; // make accessible globally
    });
});

// === RHYME ===
function buildRhymeMap(words, suffixLength = 2) {
  words.forEach(word => {
    const reversed = word.split('').reverse().join('');
    const suffix = reversed.substring(0, suffixLength);
    if (!rhymeMap.has(suffix)) rhymeMap.set(suffix, []);
    rhymeMap.get(suffix).push(word);
  });
}

function findRhymes() {
  const input = document.getElementById('rhymeInput').value.toLowerCase().trim();
  const output = document.getElementById('rhymeOutput');
  const parts = input.split(/\s+/);

  if (parts.length !== 1) {
    output.innerHTML = `<span style="color: red;"><b>Error:</b> Please enter only one word.</span>`;
    return;
  }

  const word = parts[0];
  const reversed = word.split('').reverse().join('');
  const suffix = reversed.substring(0, 2);
  const results = rhymeMap.get(suffix) || [];

  output.innerHTML = results.length
    ? `<b>Rhymes for "${word}":</b><ul>${results.filter(w => w !== word).slice(0, 20).map(w => `<li>${w}</li>`).join('')}</ul>`
    : `No rhymes found for "${word}".`;
}

// === METRE ===
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

function analyzeMetre() {
  const line = document.getElementById('metreInput').value;
  const output = document.getElementById('metreOutput');
  const count = countSyllables(line);
  output.innerHTML = `Syllable count: <b>${count}</b>`;
}

// === ALLITERATION CHECK ===
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

function checkAlliteration() {
  const line = document.getElementById('alliterationInput').value;
  const output = document.getElementById('alliterationOutput');
  const groups = groupAlliteration(line);
  const repeated = Array.from(groups.entries()).filter(([_, words]) => words.length > 1);
  output.innerHTML = repeated.length
    ? `<b>Alliteration detected:</b><ul>${repeated.map(([ch, w]) => `<li>${ch.toUpperCase()}: ${w.join(', ')}</li>`).join('')}</ul>`
    : `No alliteration detected.`;
}

// === ALLITERATION SUGGESTION ===
function suggestAlliterations(wordList, inputWord) {
  const firstChar = inputWord[0].toLowerCase();
  return wordList.filter(word => word.startsWith(firstChar) && word !== inputWord).slice(0, 20);
}

function suggestWords() {
  const input = document.getElementById("alliterationSuggestInput").value.toLowerCase().trim();
  const output = document.getElementById("alliterationSuggestOutput");

  if (!input || input.split(/\s+/).length !== 1) {
    output.innerHTML = `<span style="color: red;">Please enter only one word.</span>`;
    return;
  }

  const suggestions = suggestAlliterations(window.wordList || [], input);

  output.innerHTML = suggestions.length
    ? `<b>Words starting with "${input[0].toUpperCase()}":</b><ul>${suggestions.map(w => `<li>${w}</li>`).join('')}</ul>`
    : `No suggestions found for "${input}".`;
}
