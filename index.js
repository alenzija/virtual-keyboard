import Keyboard from './modules/keyboard.js';
import TextArea from './modules/text-area.js';

const lang = localStorage.getItem('lang') || 'en';
let isShift = false;
let isCapsLock = false;
const keysOn = new Set();

const container = document.createElement('div');
container.className = 'container';

const title = document.createElement('h1');
title.className = 'title';
title.textContent = 'Virtual Keyboard';
container.append(title);

const textArea = new TextArea(10, 140);
container.append(textArea.get());

document.body.append(container);

textArea.onFocus();
document.querySelector('textarea').addEventListener('blur', () => textArea.onFocus());
document.addEventListener('keyup', () => { textArea.cursor = textArea.textArea.selectionStart; });

const keyboard = new Keyboard(lang, isCapsLock);
await keyboard.init();
container.append(keyboard.render());

const description = document.createElement('div');
description.className = 'description';
description.innerHTML = `<p>Virtual Keyboard has been created in Windows</p>
                         <p>For changing languages use <span>left Control + left Shift</span></p>`;
container.append(description);

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

const toggleActiveCapsLock = () => {
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
  textArea.onChange(code);
  if (code === 'CapsLock') {
    isCapsLock = !isCapsLock;
    keyboard.toggleCapsLock();
    toggleActiveCapsLock();
  }
  if (code === 'ShiftLeft' && keysOn.has('ControlLeft')) {
    keyboard.changeLanguage(lang);
    keyboard.render();
    toggleActiveCapsLock();
  }
  keyboard.keys.forEach((key) => {
    if (key.code === code && key.type === 'character') {
      textArea.addValue(key.onClick(isShift));
    }
  });
};

document.querySelector('.keys').addEventListener('click', changeValue);

document.addEventListener('mousedown', (event) => {
  const target = event.target.closest('.key');
  if (!target) return;
  const { code } = target.dataset;
  if ((code === 'ShiftLeft' || code === 'ShiftRight') && !keysOn.has('ControlLeft')) {
    keyboard.toggleCapsLock();
    toggleActiveCapsLock();
    document.querySelectorAll('.shift').forEach((item) => {
      if (item.dataset.code === code) item.classList.add('active');
    });
  }
});

document.addEventListener('mouseup', (event) => {
  const target = event.target.closest('.key');
  if (!target) return;
  const { code } = target.dataset;
  if ((code === 'ShiftLeft' || code === 'ShiftRight') && !keysOn.has('ControlLeft')) {
    keyboard.toggleCapsLock();
    toggleActiveCapsLock();
  }
});

document.addEventListener('mouseout', (event) => {
  const target = event.target.closest('.key');
  if (!target) return;
  const { code } = target.dataset;
  if (target.classList.contains('active') && (code === 'ShiftLeft' || code === 'ShiftRight') && !keysOn.has('ControlLeft')) {
    keyboard.toggleCapsLock();
    toggleActiveCapsLock();
  }
});

document.addEventListener('keydown', (e) => {
  keysOn.add(e.code);
  if (e.key === 'Tab') textArea.tab();
  if (e.key === 'Alt') e.preventDefault();
  if (e.code === 'ShiftLeft' && keysOn.has('ControlLeft')) {
    keyboard.changeLanguage(lang);
    keyboard.render();
    toggleActiveCapsLock();
  } else if (e.key === 'Shift' && !isShift) {
    isShift = true;
    keyboard.toggleCapsLock();
    toggleActiveCapsLock();
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
    toggleActiveCapsLock();
  }

  if (e.key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    keyboard.toggleCapsLock();
    toggleActiveCapsLock();
  }
});
