import Key from './modules/character-key.js';

const res = await fetch('keys.json');
const keys = await res.json();

const keysClasses = [];

let lang = 'en';
let capsLock = false;

const container = document.createElement('div');
container.className = 'container';

const textArea = document.createElement('textarea');
textArea.className = 'textarea';
container.append(textArea);

document.body.append(container);

const keysContainer = document.createElement('div');
keysContainer.className = 'keys';

keys.forEach((element) => {
  const key = new Key(element);
  key.setLanguage(lang);
  keysClasses.push(key);
  keysContainer.append(key.render());
});

container.append(keysContainer);

document.addEventListener('keydown', (e) => {
  const keyItems = keysContainer.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === e.code) {
      key.classList.add('active');
    }
  });
});

document.addEventListener('keyup', (e) => {
  const keyItems = keysContainer.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === e.code) {
      key.classList.remove('active');
    }
  });
});

// Смена языка
const keysOn = new Set();

document.addEventListener('keydown', (e) => {
  textArea.focus();
  textArea.selectionStart = textArea.value.length;
  keysOn.add(e.key);
  if (e.key === 'Shift' && keysOn.has('Control')) {
    if (lang === 'en') {
      lang = 'ru';
    } else lang = 'en';
    keysContainer.innerHTML = '';
    keysClasses.forEach((key) => {
      key.setLanguage(lang);
      keysContainer.append(key.render());
    });
    container.append(keysContainer);
  }
});

document.addEventListener('keyup', (e) => {
  keysOn.delete(e.key);
  if (e.key === 'CapsLock') {
    capsLock = !capsLock;
    keysContainer.innerHTML = '';
    keysClasses.forEach((key) => {
      key.toggleCapsLock();
      keysContainer.append(key.render());
    });
    container.append(keysContainer);
  }
});

// clicks

const backSpaceEvent = new Event('input');

keysContainer.addEventListener('click', (event) => {
  const target = event.target.closest('.key');
  if (target.dataset.code === 'Backspace') {
    textArea.value = textArea.value.slice(0, -1);
    textArea.dispatchEvent(backSpaceEvent);
  } else {
    textArea.value += keysOn.has('Shift') ? target.children[0].outerText || target.children[1].outerText.toUpperCase() : target.children[1].outerText;
  }
});

//
