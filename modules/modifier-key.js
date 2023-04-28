export default class ModifierKey {
  constructor({ code, value, type }) {
    this.code = code;
    this.value = value;
    this.type = type;
  }

  setLanguage(lang) {
    if (lang === 'ru' || lang === 'en') {
      this.values = this.languages[lang];
    }
  }

  render() {
    const div = document.createElement('div');
    div.classList.add('key');
    div.dataset.code = this.code;
    div.innerHTML = `<span></span>
                     <span>${this.value}</span> `;
    return div;
  }
}
