import 'babel-polyfill';
import Quill from 'quill';
import { Aside } from './components/aside';
import { TopBar } from './components/topBar';
import { Fux } from './lib/fux';
import { SyncService } from './services/sync';
import { Config } from './components/config';

const DEBUG = true;

export class App {
  constructor() {
    this.start();
  }

  async start() {
    const content = await SyncService.load();

    this.materials = Fux.state('materials', content, { DEBUG });
    this.selected = Fux.state('selected', { uuid: content.model[0].uuid }, { DEBUG });
    this.count = Fux.state('count', {number: this.countSymbols()}, {DEBUG});
    Fux.state('config', {isShown: false}, {DEBUG});

    var toolbarOptions = [
      [{ 'font': [] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],

      [{ 'size': [] }],

      [{ 'color': [] }, { 'background': [] }],

      ['clean']
    ];

    const quill = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: 'snow'
    });

    quill.setContents(this.materials.model.find(e => e.uuid === this.selected.uuid).text);

    this.selected.onUpdate(()=> {
      quill.setContents(this.materials.model.find(e => e.uuid === this.selected.uuid).text);
    });

    quill.on('text-change', (d, o, source) => {
      if (source === 'user') { // TODO: throttle

        const contents = quill.getContents();

        this.materials.model.find(e => e.uuid === this.selected.uuid).text = contents;
        this.materials.update({
          model: this.materials.model
        });
        this.count.update({number: this.countSymbols()});
        SyncService.save({model: this.materials.model}).then(r => console.log(r));
      }
    });

    new Aside('.contents');
    new TopBar('.top-panel');
    new Config('#config');
  }

  countSymbols = () => {
    return this.materials.model
      .filter(m => m.type === 'scene')
      .filter(m => m.text)
      .reduce((acc, curr) => acc + curr.text.ops[0].insert.replace(/\n/g, '').length, 0);
  }
}
