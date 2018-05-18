import { Fux } from '../../lib/fux';

export class Compile {
  constructor(selector) {
    const el = document.querySelector(selector);
    this.el = el;

    this.materials = Fux.state('materials');

    this.ui = {
      compileTxt: el.querySelector('.compile-txt')
    };

    this.addEventListeners();
  }

  addEventListeners = () => {
    this.ui.compileTxt.addEventListener('click', this.compileTxt);
  };

  compileTxt = () => {
    const text = this.materials.model
      .reduce((acc, curr, i, arr) => {

        if (curr.type === 'chapter') {
          return acc + '\n\n' + curr.name + '\n\n';
        }

        if (curr.type === 'scene' && curr.text && curr.text.ops[0].insert !== '\n') {

          if (arr[i-1] && arr[i-1].type === 'scene') {
            acc += '\n***\n\n';
          } else {
            acc += '\n';
          }

          return acc + curr.text.ops[0].insert;
        }

        return acc;
      }, '');

      const textFileAsBlob = new Blob([text], {type:'text/plain'});
      const fileNameToSaveAs = 'compiled.txt';

      const downloadLink = document.createElement('a');
      downloadLink.download = fileNameToSaveAs;
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.click();
  };
}
