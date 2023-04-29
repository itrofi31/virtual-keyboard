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
    this.elements.keysContainer.classList.add('keyboard__keys', 'hidden');
    this.elements.keysContainer.appendChild(this._createKeys()); // append fragment

    //fill keys array
    this.elements.keys =
      this.elements.keysContainer.querySelectorAll('.keyboard__key');

    //Add to DOM
    this.elements.main.appendChild(this.elements.textArea);
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    //update info in textarea
    this.elements.textArea.addEventListener('focus', () => {
      this.elements.keysContainer.classList.remove('hidden');
      this.open(this.elements.textArea.value, (currentValue) => {
        this.elements.textArea.value = currentValue;
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    //prettier-ignore
    const keyLayout = [
      '`','1','2','3','4','5','6','7','8','9','0','-','=','del',
      'tab','q','w','e','r','t','y','u','i','o','p','[',']','\\',
      'caps lock','a','s','d','f','g','h','j','k','l',';',"'",'return',
      'shift','z','x','c','v','b','n','m',',','.','/','^','shift-r',
      'fn','ctrl','opt','cmd','space','cmd','opt','<','v','>'];

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['del', '\\', 'return', 'shift-r'].includes(key);

      //Add classes/attributes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'del':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', function () {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent('oninput');
          });
          break;

        case 'tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          break;

        case 'caps lock':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', function () {
            Keyboard._toggleCapsLock();
            keyElement.classList.toggle(
              'keyboard__key__active',
              Keyboard.properties.capsLock
            );
          });
          break;

        case 'return':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'return';

          keyElement.addEventListener('click', function () {
            Keyboard.properties.value += '\n';

            Keyboard.elements.textArea.value.substring(
              0,
              Keyboard.elements.textArea.selectionStart
            ) +
              '\n' +
              Keyboard.elements.textArea.value.substring(
                Keyboard.elements.textArea.selectionEnd,
                Keyboard.elements.textArea.value.length
              );
            Keyboard._triggerEvent('oninput');
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.textContent = key;

          break;

        case 'shift-r':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.textContent = 'shift';

          break;

        case '^':
          keyElement.classList.add('keyboard__key--margin-left');
          keyElement.textContent = '^';
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', function () {
            Keyboard.properties.value += ' ';

            Keyboard._triggerEvent('oninput');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', function () {
            // const checkCapsLock = function () {
            //   Keyboard.properties.capsLock
            //     ? key.toUpperCase()
            //     : key.toLowerCase();
            // };
            Keyboard.properties.value += Keyboard.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();
            Keyboard._triggerEvent('oninput');
          });
          break;
      }
      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent() {
    this.eventHandlers.oninput(this.properties.value);
  },

  _toggleCapsLock() {
    console.log(`Caps lock triggered`);
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach(
      (key) =>
        (key.textContent =
          this.properties.capsLock &&
          key.textContent.length === 1 &&
          key.textContent !== 'v'
            ? key.textContent.toUpperCase()
            : key.textContent.toLowerCase())
    );
  },

  open(initialValue, oninput) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
