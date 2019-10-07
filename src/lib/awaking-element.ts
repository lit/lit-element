import {UpdatingElement} from './updating-element.js';
export * from './updating-element.js';

/**
 * Base element class that extends UpdatingElement such that the element
 * initially starts inert and only becomes active when the `wakeup` method is
 * called. After `wakeup` is called, the element initializes and updates
 * normally.
 */
export class AwakingElement extends UpdatingElement {

  // Denotes the awake state of the element. When set to true, the element
  // updates normally. When set to false, the element is in an inert state.
  protected isAwake = false;

  // Avoid `initialize`, which is called from the constructor
  initialize() {}

  // Avoid calling `initializeUpdating`.
  connectedCallback() {}

  wakeup() {
    if (this.isAwake) {
      return;
    }
    this.isAwake = true;
    super.initialize();
    this.initializeWakeup();
    this.initializeUpdating();
  }

  // User initialization code should be put here and not in the `constructor`
  // or in `initialize`.
  protected initializeWakeup() {
  }

}