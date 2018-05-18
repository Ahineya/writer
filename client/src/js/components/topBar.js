import { Fux } from '../lib/fux';

export class TopBar {
  constructor(selector) {
    const el = document.querySelector(selector);
    this.el = el;

    this.config = Fux.state('config');

    this.ui = {
      toggleConfig: el.querySelector('.toggle-config')
    };

    this.addEventListeners();
  }

  addEventListeners = () => {
    this.ui.toggleConfig.addEventListener('click', this.toggleConfig);
  };

  toggleConfig = () => {
    this.config.update({
      isShown: !this.config.isShown
    });
  }

  render = () => {
    // this.el.innerHTML = this.count.number;
  }
}
