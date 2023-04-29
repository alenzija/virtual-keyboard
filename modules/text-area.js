export default class TextArea {
  constructor(rows, cols) {
    this.textArea = document.createElement('textarea');
    this.textArea.rows = rows;
    this.textArea.cols = cols;
    this.cursor = 0;
    this.value = '';
  }

  onFocus() {
    this.textArea.focus();
  }

  addValue(value) {
    const i = this.cursor;
    this.value = this.value.slice(0, i)
                          + value
                          + this.value.slice(i);
    this.textArea.value = this.value;
    this.cursor += value.length;
    this.textArea.selectionStart = this.cursor;
    this.textArea.selectionEnd = this.cursor;
  }

  backspace() {
    const i = this.cursor;
    if (i > 0) {
      this.value = this.value.slice(0, i - 1)
                            + this.value.slice(i);
      this.cursor -= 1;
      this.textArea.value = this.value;
      this.textArea.selectionStart = this.cursor;
      this.textArea.selectionEnd = this.cursor;
    }
  }

  del() {
    const i = this.cursor;
    if (i > 0) {
      this.value = this.value.slice(0, i)
                            + this.value.slice(i + 1);
      this.textArea.value = this.value;
      this.textArea.selectionStart = this.cursor;
      this.textArea.selectionEnd = this.cursor;
    }
  }

  tab() {
    this.addValue('\t');
  }

  enter() {
    this.addValue('\n');
  }

  toRight() {
    if (this.cursor < this.textArea.value.length) {
      this.cursor += 1;
      this.textArea.selectionStart = this.cursor;
      this.textArea.selectionEnd = this.cursor;
    }
  }

  toLeft() {
    if (this.cursor > 0) {
      this.cursor -= 1;
      this.textArea.selectionStart = this.cursor;
      this.textArea.selectionEnd = this.cursor;
    }
  }

  get() {
    this.textArea.classList.add('textarea');
    this.textArea.addEventListener('click', () => { this.cursor = this.textArea.selectionStart; });
    this.textArea.addEventListener('input', (e) => {
      if (e.data) {
        this.textArea.value = this.value;
        this.textArea.selectionStart = this.cursor;
        this.textArea.selectionEnd = this.cursor;
      } else {
        this.value = this.textArea.value;
      }
    });
    return this.textArea;
  }
}
