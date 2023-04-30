import Keyboard from './modules/keyboard.js';
import TextArea from './modules/text-area.js';

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

const keyboard = new Keyboard(lang, keysOn, isCapsLock);
await keyboard.init();
container.append(keyboard.render());

const onActiveKey = (event) => {
  const keyItems = document.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === event.code) {
      if (event.code === 'Tab') {
        event.preventDefault();
        setTimeout(() => { key.classList.remove('active'); }, 200);
      }
      key.classList.add('active');
    }
  });
};

const offActiveKey = (event) => {
  const keyItems = document.querySelectorAll('.key');
  keyItems.forEach((key) => {
    if (key.dataset.code === event.code) {
      key.classList.remove('active');
    }
  });
};

const onActiveCapsLock = () => {
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
};

const changeValue = (event) => {
  const target = event.target.closest('.key');
  if (!target) return;
  const { code } = target.dataset;
  if (code === 'Delete') textArea.del();
  if (code === 'Tab') textArea.tab();
  if (code === 'Enter') textArea.enter();
  if (code === 'ArrowRight') textArea.toRight();
  if (code === 'ArrowLeft') textArea.toLeft();
  if (code === 'ArrowUp') textArea.toUp();
  if (code === 'ArrowDown') textArea.toDown();
  if (code === 'Backspace') {
    textArea.backspace();
  } else {
    keyboard.keys.forEach((key) => {
      if (key.code === code && key.type === 'character') {
        textArea.addValue(key.onClick(isShift));
      }
    });
  }
};

document.querySelector('.keys').addEventListener('click', changeValue);

document.addEventListener('keydown', (e) => {
  keysOn.add(e.code);
  if (e.key === 'Tab') textArea.tab();
  if (e.key === 'Alt') e.preventDefault();
  if (e.code === 'ShiftLeft' && keysOn.has('ControlLeft')) {
    keyboard.changeLanguage(lang);
    container.append(keyboard.render());
    onActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  } else if (e.key === 'Shift' && !isShift) {
    isShift = true;
    keyboard.toggleCapsLock();
    container.append(keyboard.render());
    onActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  }
  onActiveKey(e);
});

document.addEventListener('keyup', (e) => {
  keysOn.delete(e.code);
  offActiveKey(e);

  keyboard.keys.forEach((key) => {
    if (key.type === 'character' && key.code === e.code) {
      textArea.addValue(key.onClick(isShift));
    }
  });

  if (e.key === 'Shift' && isShift) {
    isShift = false;
    keyboard.toggleCapsLock();
    container.append(keyboard.render());
    onActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  }

  if (e.key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    keyboard.toggleCapsLock();
    container.append(keyboard.render());
    onActiveCapsLock();
    document.querySelector('.keys').addEventListener('click', changeValue);
  }
});
