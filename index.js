import CharacterKey from './modules/character-key.js';
import ModifierKey from './modules/modifier-key.js';
import Keyboard from './modules/keyboard.js';

const res = await fetch('keys.json');
const keys = await res.json();

const keysClasses = [];

let lang = 'en';
let isCapsLock = false;

const keysOn = new Set();

const container = document.createElement('div');
container.className = 'container';
// textarea
const textArea = document.createElement('textarea');
textArea.className = 'textarea';
container.append(textArea);

document.body.append(container);

keys.forEach((element) => {
  let key;
  switch (element.type) {
    case 'character': {
      key = new CharacterKey(element);
      break;
    }
    case 'modifier': {
      key = new ModifierKey(element);
      break;
    }
    case 'control': {
      break;
    }
    default: throw Error('There isn\'t this type');
  }
  keysClasses.push(key);
});

const keyboard = new Keyboard(lang, keysOn, isCapsLock, keysClasses);

container.append(keyboard.render());

document.addEventListener('keydown', (e) => {
  const keyItems = container.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === e.code) {
      key.classList.add('active');
    }
  });
});

document.addEventListener('keyup', (e) => {
  const keyItems = container.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === e.code) {
      key.classList.remove('active');
    }
  });
});

// Смена языка

document.addEventListener('keydown', (e) => {
  textArea.focus();
  textArea.selectionStart = textArea.value.length;
  keysOn.add(e.key);
  if (e.key === 'Shift' && keysOn.has('Control')) {
    if (lang === 'en') {
      lang = 'ru';
    } else lang = 'en';

    keyboard.setLanguage(lang);
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
  }
});

document.addEventListener('keyup', (e) => {
  keysOn.delete(e.key);
  if (e.key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    keyboard.toggleCapsLock();
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
  }
});

// clicks

document.querySelector('.keys').addEventListener('click', (event) => {
  const target = event.target.closest('.key');

  if (!target) return;
  const { code } = target.dataset;
  keysClasses.forEach((key) => {
    if (key.code === code && key.type === 'character') {
      textArea.value += key.onClick();
    }
  });
});

//
