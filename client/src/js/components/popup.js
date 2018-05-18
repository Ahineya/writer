import { show, hide } from '../utils/ui';

export class Popup {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.ui = {
      ok: this.el.querySelector('.js-ok'),
      cancel: this.el.querySelector('.js-cancel')
    };

    this.closeCallback = () => {};

    hide(this.el);

    this._addEventListeners();
  }

  _addEventListeners() {
    if (this.ui.ok) {
      this.ui.ok.addEventListener('click', () => this._close(true));
    }

    if (this.ui.cancel) {
      this.ui.cancel.addEventListener('click', () => this._close(false));
    }
  }

  _close = isOk => {
    this.hide();
    this.closeCallback(isOk);
  }

  show = () => show(this.el);
  hide = () => hide(this.el);

  onClose = callback => this.closeCallback = callback;
}
