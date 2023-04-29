import CharacterKey from './modules/character-key.js';
import ModifierKey from './modules/modifier-key.js';
import Keyboard from './modules/keyboard.js';
import TextArea from './modules/text-area.js';

const res = await fetch('keys.json');
const keys = await res.json();

const keysClasses = [];

const lang = 'en';
let isShift = false;
let isCapsLock = false;
const keysOn = new Set();

const container = document.createElement('div');
container.className = 'container';
// textarea
const textArea = new TextArea(10, 140);
container.append(textArea.get());

document.body.append(container);

textArea.onFocus();
document.querySelector('textarea').addEventListener('blur', () => textArea.onFocus());
document.addEventListener('keyup', () => { textArea.cursor = textArea.textArea.selectionStart; });

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
  const target = event.target.closest('.key');
  if (!target) return;
  const { code } = target.dataset;
  if (code === 'Delete') textArea.del();
  if (code === 'Tab') textArea.tab();
  if (code === 'Enter') textArea.enter();
  if (code === 'ArrowRight') textArea.toRight();
  if (code === 'ArrowLeft') textArea.toLeft();
  if (code === 'Backspace') {
    textArea.backspace();
  } else {
    keysClasses.forEach((key) => {
      if (key.code === code && key.type === 'character') {
        textArea.addValue(key.onClick(isShift));
      }
    });
  }
}

function doActiveCapsLock() {
  const keyItems = container.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === 'CapsLock') {
      if (isCapsLock) {
        key.classList.add('active');
      } else {
        key.classList.remove('active');
      }
    }
  });
}

container.append(keyboard.render());
document.querySelector('.keys').addEventListener('click', changeValue);

document.addEventListener('keydown', (e) => {
  // textArea.onFocus();
  keysOn.add(e.code);
  if (e.key === 'Alt') e.preventDefault();
  if (e.code === 'ShiftLeft' && keysOn.has('ControlLeft')) {
    keyboard.changeLanguage(lang);
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    doActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  } else if (e.key === 'Shift' && !isShift) {
    isShift = true;
    keyboard.toggleCapsLock();
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    doActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  }

  const keyItems = container.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === e.code) {
      if (e.code === 'Tab') {
        e.preventDefault();
        textArea.tab();
        setTimeout(() => { key.classList.remove('active'); }, 200);
      }
      key.classList.add('active');
    }
  });
});

document.addEventListener('keyup', (e) => {
//  textArea.onFocus();
  keysOn.delete(e.code);
  const keyItems = container.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === e.code) {
      key.classList.remove('active');
    }
  });

  keysClasses.forEach((key) => {
    if (key.type === 'character' && key.code === e.code) {
      textArea.addValue(key.onClick(isShift));
    }
  });

  if (e.key === 'Shift' && isShift) {
    isShift = false;
    keyboard.toggleCapsLock();
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    doActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  }

  if (e.key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    keyboard.toggleCapsLock();
    document.querySelector('.keys').remove();
    container.append(keyboard.render());
    doActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  }
});

// Смена языка
