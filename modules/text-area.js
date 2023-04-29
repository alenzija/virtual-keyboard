export default class TextArea {
  constructor(rows, cols) {
    this.textArea = document.createElement('textarea');
    this.textArea.rows = rows;
    this.textArea.cols = cols;
    this.cursor = 0;
  }

  onFocus() {
    this.textArea.focus();
  }

  addValue(value) {
    const i = this.cursor;
    this.textArea.value = this.textArea.value.slice(0, i)
                          + value
                          + this.textArea.value.slice(i);
    this.cursor += value.length;
    this.textArea.selectionStart = this.cursor;
    this.textArea.selectionEnd = this.cursor;
  }

  backspace() {
    const i = this.cursor;
    if (i > 0) {
      this.textArea.value = this.textArea.value.slice(0, i - 1)
                            + this.textArea.value.slice(i);
      this.cursor -= 1;
      this.textArea.selectionStart = this.cursor;
      this.textArea.selectionEnd = this.cursor;
    }
  }

  tab() {
    this.addValue('  ');
  }

  get() {
    this.textArea.classList.add('textarea');
    this.textArea.addEventListener('click', () => { this.cursor = this.textArea.selectionStart; });
    return this.textArea;
  }
}
