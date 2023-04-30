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

  getIndex() {
    let i = 0;
    let j = 0;
    for (let k = 0; k < this.cursor; k += 1) {
      if (this.value[k] === '\n') {
        j += 1;
        i = 0;
      } else if (this.value[k] === '\t') {
        i += 7;
      } else i += 1;
      if (i >= this.textArea.cols) {
        j += 1;
        i -= this.textArea.cols;
      }
    }
    return { i, j };
  }

  setIndex(i, j) {
    let cursor = 0;
    let row = 0;
    let cols = 0;
    while (row !== j && cursor < this.value.length) {
      switch (this.value[cursor]) {
        case '\t': {
          cols += 7;
          break;
        }
        case '\n': {
          cols = 0;
          row += 1;
          break;
        }
        default: cols += 1;
      }
      if (cols >= this.textArea.cols) {
        row += 1;
        cols -= this.textArea.cols;
      }
      cursor += 1;
    }
    while (cols < i && cursor < this.value.length && this.value[cursor] !== '\n') {
      switch (this.value[cursor]) {
        case '\t': {
          cols += 7;
          break;
        }
        default: cols += 1;
      }
      cursor += 1;
    }
    if (row !== j) cursor = this.cursor;
    return cursor;
  }

  toUp() {
    const { i, j } = this.getIndex();
    this.cursor = this.setIndex(i, j - 1);
    this.textArea.selectionStart = this.cursor;
    this.textArea.selectionEnd = this.cursor;
  }

  toDown() {
    const { i, j } = this.getIndex();
    this.cursor = this.setIndex(i, j + 1);
    this.textArea.selectionStart = this.cursor;
    this.textArea.selectionEnd = this.cursor;
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
