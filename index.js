import Key from './modules/key.js';

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
  keysClasses.forEach((key) => {
    if (key.code === e.code) {
      key.toggleActive();
    }
  });
});

document.addEventListener('keyup', (e) => {
  keysClasses.forEach((key) => {
    if (key.code === e.code) {
      key.toggleActive();
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
  const { target } = event;
  if (target.classList.contains('key')) {
    if (target.dataset.code === 'Backspace') {
      textArea.value = textArea.value.slice(0, -1);
      textArea.dispatchEvent(backSpaceEvent);
    } else {
      textArea.value += keysOn.has('Shift') ? target.children[0].outerText || target.children[1].outerText.toUpperCase() : target.children[1].outerText;
    }
  }
  if (target.parentElement.classList.contains('key')) {
    if (target.parentElement.dataset.code === 'Backspace') {
      textArea.value = textArea.value.slice(0, -1);
      textArea.dispatchEvent(backSpaceEvent);
    } else {
      textArea.value += keysOn.has('Shift') ? target.parentElement.children[0].outerText || target.parentElement.children[1].outerText.toUpperCase() : target.parentElement.children[1].outerText;
    }
  }
});

//
