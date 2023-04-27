export default class {
  constructor({ code, languages }) {
    this.code = code;
    this.languages = languages;
    this.values = languages.en;
    this.isActive = false;
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  setLanguage(lang) {
    if (lang === 'ru' || lang === 'en') {
      this.values = this.languages[lang];
    }
  }

  toggleCapsLock() {
    if (this.values[0].length === 1) {
      if (this.values[0].toUpperCase() !== this.values[1].toLowerCase()) {
        this.values[0] = this.values[0] === this.values[0].toUpperCase()
          ? this.values[0].toLowerCase()
          : this.values[0].toUpperCase();
      }
    }
  }

  render() {
    const div = document.createElement('div');
    div.classList.add('key');
    if (this.isActive) div.classList.add('active');
    div.dataset.code = this.code;
    div.innerHTML = `<span>${this.values[1]}</span>
                     <span>${this.values[0]}</span> `;
    return div;
  }
}
