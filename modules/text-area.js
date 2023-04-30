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
    if (this.textArea.selectionStart !== this.textArea.selectionEnd) {
      this.delSub();
    }
    this.value = this.value.slice(0, this.cursor)
                          + value
                          + this.value.slice(this.cursor);
    this.textArea.value = this.value;
    this.cursor += value.length;
    this.textArea.selectionStart = this.cursor;
    this.textArea.selectionEnd = this.cursor;
  }

  delSub() {
    this.cursor = this.textArea.selectionStart;
    this.value = this.value.slice(0, this.textArea.selectionStart)
                  + this.value.slice(this.textArea.selectionEnd);
    this.textArea.value = this.value;
    this.textArea.selectionStart = this.cursor;
    this.textArea.selectionEnd = this.cursor;
  }

  backspace() {
    if (this.textArea.selectionStart !== this.textArea.selectionEnd) {
      this.delSub();
    } else if (this.cursor > 0) {
      this.value = this.value.slice(0, this.cursor - 1)
                            + this.value.slice(this.cursor);
      this.cursor -= 1;
      this.textArea.value = this.value;
      this.textArea.selectionStart = this.cursor;
      this.textArea.selectionEnd = this.cursor;
    }
  }

  del() {
    if (this.textArea.selectionStart !== this.textArea.selectionEnd) {
      this.delSub();
    } else {
      this.value = this.value.slice(0, this.cursor)
                            + this.value.slice(this.cursor + 1);
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
    if (j < 0) return 0;
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
    if (row !== j) cursor = this.value.length;
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

  onChange(code) {
    switch (code) {
      case 'Delete': {
        this.del();
        break;
      }
      case 'Tab': {
        this.tab();
        break;
      }
      case 'Enter': {
        this.enter();
        break;
      }
      case 'ArrowRight': {
        this.toRight();
        break;
      }
      case 'ArrowLeft': {
        this.toLeft();
        break;
      }
      case 'ArrowUp': {
        this.toUp();
        break;
      }
      case 'ArrowDown': {
        this.toDown();
        break;
      }
      case 'Backspace': {
        this.backspace();
        break;
      }
      default: {
        break;
      }
    }
  }
}
