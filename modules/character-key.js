export default class CharacterKey {
  constructor({
    code, languages, type, isCapsLock = false,
  }) {
    this.code = code;
    this.languages = languages;
    this.values = languages.en;
    this.type = type;
    this.isCapsLock = isCapsLock;
  }

  initLanguage(lang) {
    this.values = this.languages[lang];
  }

  setLanguage(lang, isCapsLock) {
    this.values = this.languages[lang];
    if (this.isCapsLock !== isCapsLock) {
      this.toggleCapsLock();
      this.isCapsLock = isCapsLock;
    }
  }

  toggleCapsLock() {
    if (this.values[0].toUpperCase() !== this.values[0].toLowerCase()) {
      this.values[0] = this.values[0] === this.values[0].toUpperCase()
        ? this.values[0].toLowerCase()
        : this.values[0].toUpperCase();
    }
  }

  onClick(isShift) {
    return isShift && this.values[1] !== '' ? this.values[1] : this.values[0];
  }

  render() {
    const div = document.createElement('div');
    div.classList.add('key');
    div.dataset.code = this.code;
    div.innerHTML = `<span>${this.values[1]}</span>
                     <span>${this.values[0]}</span> `;
    return div;
  }
}
