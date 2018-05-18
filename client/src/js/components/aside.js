import { Material } from './material';
import { Fux } from '../lib/fux';
import Sortable from 'sortablejs';
import { SyncService } from '../services/sync';
import { uuid } from '../utils/uuid';
import { Popup } from './popup';

export class Aside {
  constructor(selector) {
    this.ui = document.querySelector(selector);
    this.materialElems = [];
    this.materials = Fux.state('materials');
    this.selected = Fux.state('selected');
    this.count = Fux.state('count');

    this.selected.onUpdate(this.render);

    this.renamePopup = new Popup('.js-rename-popup');
    const input = this.renamePopup.el.querySelector('input');
    input.addEventListener('keydown', e => {
      if (e.which == 13 || e.keyCode == 13) {
        this.renamePopup._close(true);
      } else if (event.which == 27 || event.keyCode == 27) {
        this.renamePopup._close(false);
      }
    });

    this.render();
  }

  command = cmd => {
    console.log(cmd);

    let index;
    let newUuid;
    let elem;
    let input;

    switch (cmd.command) {
      case 'addTop':
        index = this.materials.model.findIndex(m => m.uuid === cmd.uuid);
        newUuid = uuid(); // TODO: make unique!
        this.materials.model.splice(index, 0, {
          uuid: newUuid,
          name: 'Scene',
          text: null,
          type: 'scene'
        });
        this.materials.update({model: this.materials.model});
        SyncService.save({model: this.materials.model}).then(r => {
          console.log(r);
          this.render();
        });
      break;
      case 'addBottom':
        index = this.materials.model.findIndex(m => m.uuid === cmd.uuid);
        newUuid = uuid(); // TODO: make unique!
        this.materials.model.splice(index + 1, 0, {
          uuid: newUuid,
          name: 'Scene',
          text: null,
          type: 'scene'
        });
        this.materials.update({model: this.materials.model});
        SyncService.save({model: this.materials.model}).then(r => {
          console.log(r);
          this.render();
        });
      break;
      case 'delete':
        this.materials.update({
          model: this.materials.model.filter(m => m.uuid !== cmd.uuid)
        });
        this.count.update({number: this.countSymbols()});
        SyncService.save({model: this.materials.model}).then(r => {
          console.log(r);
          this.render();
        });
      break;
      case 'convert':
        elem = this.materials.model.find(m => m.uuid === cmd.uuid);
        elem.type = elem.type === 'scene' ? 'chapter' : 'scene';
        this.materials.update({
          model: this.materials.model
        });
        this.count.update({number: this.countSymbols()});
        SyncService.save({model: this.materials.model}).then(r => {
          console.log(r);
          this.render();
        });
      break;
      case 'exclude':
        elem = this.materials.model.find(m => m.uuid === cmd.uuid);
        elem.type = 'exclude';
        this.materials.update({
          model: this.materials.model
        });
        this.count.update({number: this.countSymbols()});
        SyncService.save({model: this.materials.model}).then(r => {
          console.log(r);
          this.render();
        });
      break;
      case 'rename':
        input = this.renamePopup.el.querySelector('input');
        elem = this.materials.model.find(m => m.uuid === cmd.uuid);
        input.value = elem.name;
        this.renamePopup.show();
        this.renamePopup.onClose(isOk => {
          if (isOk) {
            elem.name = input.value;
            this.materials.update({
              model: this.materials.model
            });
            SyncService.save({model: this.materials.model}).then(r => {
              console.log(r);
              this.render();
            });
          }
        });
        input.focus();
        input.select();
      break;
    }
  }

  render = () => {
    this.materialElems.forEach(e => e.destroy());
    this.materialElems = [];

    this.ui.innerHTML = '';

    this.materials.model.forEach(elem => {
      const div = document.createElement('div');
      this.ui.appendChild(div);
      this.materialElems.push(new Material(div, elem, this.command));
    });

    Sortable.create(this.ui, {
      onEnd: evt => {
        const elem = this.materials.model[evt.oldIndex];
        this.materials.model.splice(evt.oldIndex,1);
        this.materials.model.splice(evt.newIndex, 0, elem);
        this.materials.update({
          model: this.materials.model
        });
        SyncService.save({model: this.materials.model}).then(r => {
          console.log(r);
          this.render();
        });
      }
    });
  }
  countSymbols = () => {
    return this.materials.model
      .filter(m => m.type === 'scene')
      .filter(m => m.text)
      .reduce((acc, curr) => acc + curr.text.ops[0].insert.replace(/\n/g, '').length, 0);
  }
}
