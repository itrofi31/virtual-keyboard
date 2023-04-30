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
    event: null,
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
    this.elements.main.insertAdjacentHTML(
      'beforeend',
      `<h1>Virtual keyboard</h1>`
    );
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

    this.showPressedKeys();
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    //prettier-ignore
    const keyLayout = [
      '`','1','2','3','4','5','6','7','8','9','0','-','=','del',
      'tab','q','w','e','r','t','y','u','i','o','p','[',']','\\',
      'caps lock','a','s','d','f','g','h','j','k','l',';',"'",'enter',
      'shift-1','z','x','c','v','b','n','m',',','.','/','shift-2',
      'ctrl','opt-1','cmd-1','space','cmd-2','opt-2',];

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['del', '\\', 'enter', 'shift-2'].includes(key);

      //Add classes/attributes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'del':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.textContent = key;
          keyElement.dataset.value = 'backspace';

          keyElement.addEventListener('click', function () {
            Keyboard.deleteChar();
            Keyboard._triggerEvent('oninput');
          });
          break;

        case 'tab':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.textContent = key;
          keyElement.dataset.value = 'tab';

          break;

        case 'caps lock':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;
          keyElement.dataset.value = 'capslock';

          keyElement.addEventListener('click', function () {
            Keyboard._toggleCapsLock();
            keyElement.classList.toggle(
              'keyboard__key__active',
              Keyboard.properties.capsLock
            );
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'enter';
          keyElement.dataset.value = 'enter';

          keyElement.addEventListener('click', function () {
            Keyboard.properties.value += '\n';

            // Keyboard.elements.textArea.value.substring(
            //   0,
            //   Keyboard.elements.textArea.selectionStart
            // ) +
            //   '\n' +
            //   Keyboard.elements.textArea.value.substring(
            //     Keyboard.elements.textArea.selectionEnd,
            //     Keyboard.elements.textArea.value.length
            //   );
            Keyboard._triggerEvent('oninput');
          });
          break;

        case 'shift-1':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'shift';
          keyElement.dataset.value = 'shift-1';
          break;

        case 'shift-2':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'shift';
          keyElement.dataset.value = 'shift-2';
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent = key;
          keyElement.dataset.value = ' ';

          keyElement.addEventListener('click', function () {
            Keyboard.properties.value += ' ';

            Keyboard._triggerEvent('oninput');
          });
          break;

        case 'cmd-1':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.dataset.value = 'meta-1';
          keyElement.textContent = 'cmd';
          break;

        case 'cmd-2':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.dataset.value = 'meta-2';
          keyElement.textContent = 'cmd';
          break;

        case 'opt-1':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.dataset.value = 'alt-1';
          keyElement.textContent = 'opt';
          break;

        case 'opt-2':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.dataset.value = 'alt-2';
          keyElement.textContent = 'opt';
          break;

        case 'ctrl':
          keyElement.classList.add('keyboard__key--medium');
          keyElement.dataset.value = 'control';
          keyElement.textContent = 'ctrl';
          break;

        case '\\':
          keyElement.dataset.value = '\\\\';
          keyElement.textContent = '\\';
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.dataset.value = key;

          keyElement.addEventListener(
            'click',
            function () {
              console.log(keyElement.textContent);
              keyElement.textContent.length === 1
                ? (this.properties.value += this.properties.capsLock
                    ? key.toUpperCase()
                    : key.toLowerCase())
                : keyElement;
              this._triggerEvent('oninput');
            }.bind(Keyboard)
          );
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

  deleteChar() {
    Keyboard.properties.value = Keyboard.properties.value.substring(
      0,
      Keyboard.properties.value.length - 1
    );
    //check if textarea is out of focus, so do not delete twice
    if (Keyboard.elements.textArea !== document.activeElement) {
      Keyboard.elements.textArea.value = Keyboard.properties.value;
    }
  },

  _toggleActive(action) {
    document
      .querySelector(
        `.keyboard__key[data-value='${Keyboard.properties.event.key.toLowerCase()}']`
      )
      ?.classList[action === 'add' ? 'add' : 'remove']('keyboard__key__active');
  },

  _toggleActiveWithLocation(action) {
    document
      .querySelector(
        `.keyboard__key[data-value='${Keyboard.properties.event.key.toLowerCase()}-${
          Keyboard.properties.event.location
        }']`
      )
      ?.classList[action === 'add' ? 'add' : 'remove']('keyboard__key__active');
  },

  showPressedKeys() {
    document.addEventListener('keydown', (e) => {
      //prettier-ignore
      const specialSymbols = ['Shift','Control','Alt','Meta','Tab','Enter','Space','Backspace','CapsLock'];

      if (!specialSymbols.includes(e.key)) {
        Keyboard.properties.value += e.key;
        if (Keyboard.elements.textArea !== document.activeElement) {
          Keyboard.elements.textArea.value = Keyboard.properties.value;
        }
      }
      console.log(e);
      Keyboard.properties.event = e;
      switch (e.key) {
        case 'CapsLock':
          Keyboard._toggleActive('add');
          Keyboard._toggleCapsLock();
          break;

        case 'Backspace':
          Keyboard._toggleActive('add');
          Keyboard.deleteChar();
          break;

        case 'Tab':
          Keyboard._toggleActive('add');
          break;

        case 'Enter':
          Keyboard._toggleActive('add');
          Keyboard.properties.value += '\n';
          break;

        case 'Shift':
          Keyboard._toggleActiveWithLocation('add');
          break;

        case 'Meta':
          Keyboard._toggleActiveWithLocation('add');
          break;

        case 'Alt':
          Keyboard._toggleActiveWithLocation('add');
          break;

        case 'Control':
          Keyboard._toggleActive('add');
          break;

        default:
          Keyboard._toggleActive('add');
          break;
      }
    });

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'CapsLock':
          Keyboard._toggleActive('remove');
          Keyboard._toggleCapsLock();
          break;

        case 'Backspace':
          Keyboard._toggleActive('remove');
          break;

        case 'Tab':
          Keyboard._toggleActive('remove');
          break;

        case 'Enter':
          Keyboard._toggleActive('remove');
          break;

        case 'Shift':
          Keyboard._toggleActiveWithLocation('remove');
          break;

        case 'Meta':
          Keyboard._toggleActiveWithLocation('remove');
          break;

        case 'Alt':
          Keyboard._toggleActiveWithLocation('remove');
          break;

        case 'Control':
          Keyboard._toggleActive('remove');
          break;

        default:
          Keyboard._toggleActive('remove');
          break;
      }
    });
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
