export default class Keyboard {
  constructor(lang, setOnKeys, keys, isCapsLock = false) {
    this.lang = lang;
    this.setOnKeys = setOnKeys;
    this.keys = keys;
    this.isCapsLock = isCapsLock;
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
    const keysContainer = document.createElement('div');
    keysContainer.className = 'keys';
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
      keysContainer.append(key.render());
    });
    return keysContainer;
  }
}
