export default class ModifierKey {
  constructor({ code, name, type }) {
    this.code = code;
    this.name = name;
    this.type = type;
  }

  render() {
    const div = document.createElement('div');
    div.classList.add('key', 'modifier');
    div.classList.add(this.name.replace(/ /g, ''));
    div.dataset.code = this.code;
    div.innerHTML = `<span></span>
                     <span>${this.name}</span> `;
    return div;
  }
}
