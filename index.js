const res = await fetch('keys.json');
const keys = await res.json();
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

function createKey({ languages, code }) {
  const div = document.createElement('div');
  div.classList.add('key');
  div.dataset.code = code;
  div.innerHTML = !capsLock ? `<span>${Array.isArray(languages[lang]) ? languages[lang][1] : ''}</span>
                  <span>${Array.isArray(languages[lang]) ? languages[lang][0] : languages[lang]}</span> `
    : `<span>${Array.isArray(languages[lang]) ? languages[lang][1] : ''}</span>
    <span>${Array.isArray(languages[lang]) ? languages[lang][0].toUpperCase() : languages[lang].length === 1 ? languages[lang].toUpperCase() : languages[lang]}</span>`;
  return div;
}

keys.forEach((element) => {
  keysContainer.append(createKey(element));
});

container.append(keysContainer);

textArea.addEventListener('keydown', (e) => {
  const keysList = document.querySelectorAll('.key');
  keysList.forEach((item) => {
    if (item.dataset.code === e.code) {
      item.classList.add('active');
    }
  });
});

textArea.addEventListener('keyup', (e) => {
  const keysList = document.querySelectorAll('.key');
  keysList.forEach((item) => {
    if (item.dataset.code === e.code) {
      item.classList.remove('active');
    }
  });
});

// Смена языка
const keysOn = new Set();

document.addEventListener('keydown', (e) => {
  keysOn.add(e.key);
  if (e.key === 'Shift' && keysOn.has('Control')) {
    if (lang === 'en') {
      lang = 'ru';
    } else lang = 'en';

    // TODO: do function render!!
    keysContainer.innerHTML = '';
    keys.forEach((element) => {
      keysContainer.append(createKey(element));
    });
    container.append(keysContainer);
  }
});

document.addEventListener('keyup', (e) => {
  keysOn.delete(e.key);
  if (e.key === 'CapsLock') {
    capsLock = !capsLock;
    keysContainer.innerHTML = '';
    keys.forEach((element) => {
      keysContainer.append(createKey(element));
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
