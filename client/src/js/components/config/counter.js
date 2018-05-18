import { Fux } from '../../lib/fux';

export class Counter {
  constructor(selector) {
    this.el = document.querySelector(selector);

    this.count = Fux.state('count');
    this.count.onUpdate(this.render);
    this.render();
  }

  render = () => {
    this.el.innerHTML = this.count.number;
  }
}
