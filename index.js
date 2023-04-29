import CharacterKey from './modules/character-key.js';
import ModifierKey from './modules/modifier-key.js';
import Keyboard from './modules/keyboard.js';

const res = await fetch('keys.json');
const keys = await res.json();

const keysClasses = [];

const lang = 'en';
let isShift = false;
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
      key.initLanguage(lang);
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

const keyboard = new Keyboard(lang, keysOn, keysClasses);

function changeValue(event) {
  textArea.focus();
  textArea.selectionStart = textArea.value.length;
  const target = event.target.closest('.key');
  if (!target) return;
  const { code } = target.dataset;
  if (code === 'Backspace') {
    textArea.value = textArea.value.slice(0, -1);
  } else {
    keysClasses.forEach((key) => {
      if (key.code === code && key.type === 'character') {
        textArea.value += key.onClick(isShift);
      }
    });
  }
}

container.append(keyboard.render());
document.querySelector('.keys').addEventListener('click', changeValue);

document.addEventListener('keydown', (e) => {
  const keyItems = container.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === e.code) {
      if (e.code === 'Tab') {
        e.preventDefault();
        setTimeout(() => { key.classList.remove('active'); }, 200);
      }
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
  keysOn.add(e.code);
  if (e.key === 'Shift' && !isShift) {
    isShift = true;
    keyboard.toggleCapsLock();
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    document.querySelector('.keys').addEventListener('click', changeValue);
  }
  if (e.code === 'ShiftLeft' && keysOn.has('ControlLeft')) {
    keyboard.changeLanguage(lang);
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    document.querySelector('.keys').addEventListener('click', changeValue);
  }
});

document.addEventListener('keyup', (e) => {
  textArea.focus();
  textArea.selectionStart = textArea.value.length;
  keysOn.delete(e.code);
  if (e.key === 'Shift') {
    isShift = false;
    keyboard.toggleCapsLock();
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    document.querySelector('.keys').addEventListener('click', changeValue);
  }

  if (e.key === 'CapsLock') {
    keyboard.toggleCapsLock();
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    document.querySelector('.keys').addEventListener('click', changeValue);
  }
});
