const fullState = {};

class FuxState {
  constructor(tree, options = {}, name) {
    this._options = options;
    this._updateCallbacks = [];
    this._name = name;
    Object.keys(tree).forEach(k => this[k] = tree[k]);
  }

  update = tree => {
    Object.keys(tree).forEach(k => this[k] = tree[k]);
    this._updateCallbacks.forEach(cb => cb(this));
    if (this._options.DEBUG) {
      console.log(this._name, this);
    }
  }

  onUpdate = cb => {
    this._updateCallbacks.push(cb);
  }
}
export class Fux {
  static state = (name, tree, options = {}) => {
    if (fullState[name]) {
      return fullState[name];
    }

    const stateObj = new FuxState(tree, options, name);
    fullState[name] = stateObj;
    Object.defineProperty(stateObj, 'update', { configurable: false, writable: false });
    Object.defineProperty(stateObj, 'onUpdate', { configurable: false, writable: false });
    return stateObj;
  }
}
