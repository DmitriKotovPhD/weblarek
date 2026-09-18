import { ensureElement } from '@/utils/utils';
import { Component } from '../base/Component';
import { IEvents } from "../base/Events";

export interface ICartView {
  items: HTMLElement[];
  subtotal: number;
  checkoutEnabled: boolean;
}

export class CartView extends Component<ICartView> {
  protected itemsContainer: HTMLElement;
  protected subtotalElement: HTMLElement;
  protected checkoutButton: HTMLButtonElement;


  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.itemsContainer = ensureElement<HTMLElement>('.basket__list', this.container);
    this.subtotalElement = ensureElement<HTMLElement>('.modal__actions > .basket__price', this.container);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.modal__actions > .basket__button', this.container);

    this.checkoutButton.addEventListener('click', () => {
      this.eventBroker.emit('cart:submit');
    });
  }

  set items(value: HTMLElement[]) {
    this.itemsContainer.replaceChildren(...value);
  }

  set subtotal(value: number) {
    this.subtotalElement.textContent = `${value} синапсов`;
  }

  set checkoutEnabled(enabled: boolean) {
    this.checkoutButton.disabled = !enabled;
  }
}