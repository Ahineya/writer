import { Fux } from '../lib/fux';
import { createButton } from '../utils/ui';

export class Material {
  constructor(element, data, cmd) {
    this.ui = element;
    this.selected = Fux.state('selected');

    this.ui.className = 'material';
    this.ui.classList.add(`material-${data.type}`);
    if (this.selected.uuid === data.uuid) {
      this.ui.classList.add('material-selected');
    }

    this.data = data;
    this.cmd = cmd;


    this.addEventListeners();
    this.render();
  }

  addEventListeners = () => {
    this.ui.addEventListener('click', this.select);
  }

  select = () => {
    console.log(this.data.uuid);
    this.selected.update({
      uuid: this.data.uuid
    });
  }

  addTop = e => {
    this.cmd({command: 'addTop', uuid: this.data.uuid});
    e.stopPropagation();
  }

  addBottom = e => {
    this.cmd({command: 'addBottom', uuid: this.data.uuid});
    e.stopPropagation();
  }

  rename = e => {
    this.cmd({command: 'rename', uuid: this.data.uuid});
    e.stopPropagation();
  }

  convert = e => {
    this.cmd({command: 'convert', uuid: this.data.uuid});
    e.stopPropagation();
  }

  exclude = e => {
    this.cmd({command: 'exclude', uuid: this.data.uuid});
    e.stopPropagation();
  }

  delete = e => {
    this.cmd({command: 'delete', uuid: this.data.uuid});
    e.stopPropagation();
  }

  config = e => {
    this.cmd({command: 'config', uuid: this.data.uuid});
    e.stopPropagation();
  }

  destroy() {
    this.ui.removeEventListener('click', this.select);
    this.top.removeEventListener('click', this.addTop);
    this.bottom.removeEventListener('click', this.addBottom);
    this.deleteBtn.removeEventListener('click', this.delete);
    this.convertBtn.removeEventListener('click', this.convert);
    this.renameBtn.removeEventListener('click', this.rename);
    this.excludeBtn.removeEventListener('click', this.exclude);
  }

  render = () => {
    this.ui.innerHTML = this.data.name;

    this.top = createButton('add-top', '^', this.addTop);
    this.ui.appendChild(this.top);

    this.bottom = createButton('add-bottom', 'v', this.addBottom);
    this.ui.appendChild(this.bottom);

    this.deleteBtn = createButton('delete', 'x', this.delete);
    this.ui.appendChild(this.deleteBtn);

    this.convertBtn = createButton('convert', 'c', this.convert);
    this.ui.appendChild(this.convertBtn);

    this.renameBtn = createButton('rename', 'r', this.rename);
    this.ui.appendChild(this.renameBtn);

    this.excludeBtn = createButton('exclude', 'e', this.exclude);
    this.ui.appendChild(this.excludeBtn);
  }
}
