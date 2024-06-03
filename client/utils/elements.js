/**
 * Registers a custom element with the specified name and constructor function in the browser's custom elements registry.
 * The constructor function is extended with any dependencies provided, and the resulting custom element is defined
 * using the provided name.
 *
 * @param name - The name under which the custom element will be registered.
 * @param elementConstructor - The constructor function for the custom element.
 * @param deps - An array of dependencies to be passed to the constructor function.
 */
export const registerCustomElement = (name, elementConstructor, deps) => {
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  if (typeof elementConstructor !== 'function') {
    throw new TypeError('Constructor must be a function');
  }

  customElements.define(name, class extends elementConstructor {
    constructor() {
      super(...deps);
    }
  });
}
