import { Counter } from './config/counter';
import { Compile } from './config/compile';
import { Fux } from '../lib/fux';

export class Config {
  constructor(selector) {
    this.el = document.querySelector(selector);
    const cc = new Counter('.config-count');
    const compile = new Compile('.compile');

    this.model = Fux.state('config');
    this.model.onUpdate(this.render);

    this.render();
  }

  render = () => {
    this.el.classList.toggle('config-hidden', !this.model.isShown);
  }
}
