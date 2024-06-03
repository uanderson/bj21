import { registerCustomElement } from './elements.js';

describe('registerElement', () => {
  let originalDefine;

  beforeEach(() => {
    originalDefine = window.customElements.define;
    window.customElements.define = vi.fn();
  });

  afterEach(() => {
    window.customElements.define = originalDefine;
  });

  it('should register a new custom element with the given name and constructor', () => {
    class TestElement extends HTMLElement {
    }

    registerCustomElement('test-element', TestElement);

    expect(window.customElements.define).toHaveBeenCalledWith('test-element', expect.any(Function));
  });

  it('should pass dependencies to the constructor of the custom element', () => {
    window.customElements.define = originalDefine;

    class TestElement extends HTMLElement {
      constructor(foo, bar) {
        super();
        this.foo = foo;
        this.bar = bar;
      }
    }

    registerCustomElement('test-element', TestElement, [ 'foo', 'bar' ]);
    const instance = document.createElement('test-element');

    expect(instance.foo).toBe('foo');
    expect(instance.bar).toBe('bar');
  });

  it('should throw an error if the name is not a string', () => {
    class TestElement extends HTMLElement {
    }

    expect(() => registerCustomElement(123, TestElement)).toThrowError(TypeError);
  });

  it('should throw an error if the constructor is not a function', () => {
    expect(() => registerCustomElement('test-element', 'not a function')).toThrowError(TypeError);
  });
});
