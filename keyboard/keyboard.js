'use strict';

const Keyboard = {
  elements: {
    main: null,
    textArea: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
  },

  init() {
    //Create main elements
    this.elements.main = document.createElement('div');
    this.elements.textArea = document.createElement('textarea');
    this.elements.keysContainer = document.createElement('div');

    //Setup main elements
    this.elements.main.classList.add('keyboard');
    this.elements.textArea.classList.add('textarea');
    this.elements.keysContainer.classList.add('keyboard__keys');

    //Add to DOM
    this.elements.main.appendChild(this.elements.textArea);
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
  },

  _createKeys() {},

  _triggerEvent(handlerName) {
    console.log(`Event triggered: ${handlerName}`);
  },

  _toggleCapsLock() {
    console.log(`Caps lock triggered`);
  },

  open(initialValue, oninput, onclose) {},

  close() {},
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
