import { ensureElement } from '@/utils/utils';
import { Component } from '../base/Component';
import { IEvents } from "../base/Events";

export interface ICartView {
  items: HTMLElement[];
  subtotal: number;
}

export class CartView extends Component<ICartView> {
  protected itemsContainer: HTMLElement;
  protected subtotal: HTMLElement;
  protected checkoutButton: HTMLButtonElement;


  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.itemsContainer = ensureElement<HTMLElement>('.basket__list', this.container);
    this.subtotal = ensureElement<HTMLElement>('.modal__actions > .basket__price', this.container);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.modal__actions > .basket__button', this.container);

    this.checkoutButton.addEventListener('click', (e: MouseEvent) => {
      this.eventBroker.emit('cart:checkout');
    });
  }

  set items(value: HTMLElement[]) {
    this.itemsContainer.replaceChildren(...value);
  }

  set subtotalContent(value: number) {
    this.subtotal.textContent = `${value} синапсов`;
  }

  // addItem(value: HTMLElement): void {
  //   // TODO
  // }

  enableCheckout(enable: boolean = true): void {
    this.checkoutButton.disabled = !enable;
  }
}