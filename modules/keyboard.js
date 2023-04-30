import CharacterKey from './character-key.js';
import ModifierKey from './modifier-key.js';

export default class Keyboard {
  constructor(lang, setOnKeys, isCapsLock) {
    this.keyboard = document.createElement('div');
    this.lang = lang;
    this.setOnKeys = setOnKeys;
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

  changeLanguage() {
    this.lang = (this.lang === 'ru') ? 'en' : 'ru';
    this.keys.forEach((key) => {
      if (key.type === 'character') key.setLanguage(this.lang, this.isCapsLock);
    });
  }

  toggleCapsLock() {
    this.isCapsLock = !this.isCapsLock;
    this.keys.forEach((key) => {
      if (key.type === 'character') key.toggleCapsLock();
    });
  }

  render() {
    this.keyboard.innerHTML = '';
    this.keyboard.className = 'keys';
    this.keys.forEach((key) => {
      switch (key.type) {
        case 'character': {
          break;
        }
        case 'modifier': {
          break;
        }
        case 'control': {
          break;
        }
        default: throw new Error('this type there aren\'t');
      }
      this.keyboard.append(key.render());
    });
    return this.keyboard;
  }
}
