import CharacterKey from './character-key.js';
import ModifierKey from './modifier-key.js';

export default class Keyboard {
  constructor(lang, isCapsLock) {
    this.keyboard = document.createElement('div');
    this.keyboard.className = 'keys';
    this.lang = lang;
    this.keys = [];
    this.isCapsLock = isCapsLock;
  }

  async init() {
    const res = await fetch('keys.json');
    const keys = await res.json();
    keys.forEach((item) => {
      let key;
      switch (item.type) {
        case 'character': {
          key = new CharacterKey(item);
          key.initLanguage(this.lang);
          break;
        }
        case 'modifier': {
          key = new ModifierKey(item);
          break;
        }
        case 'control': {
          break;
        }
        default: throw Error('There isn\'t this type');
      }
      this.keys.push(key);
    });
  }

  toggleCapsLock() {
    this.isCapsLock = !this.isCapsLock;
    this.keys.forEach((key) => {
      if (key.type === 'character') key.toggleCapsLock();
    });
    this.render();
  }

  changeLanguage() {
    this.lang = (this.lang === 'ru') ? 'en' : 'ru';
    localStorage.setItem('lang', this.lang);
    this.keys.forEach((key) => {
      if (key.type === 'character') key.setLanguage(this.lang, this.isCapsLock);
    });
  }

  render() {
    this.keyboard.innerHTML = '';
    this.keys.forEach((key) => { this.keyboard.append(key.render()); });
    return this.keyboard;
  }
}
