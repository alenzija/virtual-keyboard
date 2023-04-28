export default class CharacterKey {
  constructor({ code, languages, type }) {
    this.code = code;
    this.languages = languages;
    this.values = languages.en;
    this.type = type;
  }

  setLanguage(lang) {
    if (lang === 'ru' || lang === 'en') {
      this.values = this.languages[lang];
    }
  }

  toggleCapsLock() {
    if (this.values[0].length === 1) {
      if (this.values[0].toUpperCase() !== this.values[0].toLowerCase()) {
        this.values[0] = this.values[0] === this.values[0].toUpperCase()
          ? this.values[0].toLowerCase()
          : this.values[0].toUpperCase();
      }
    }
  }

  onClick(isShift = false) {
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
