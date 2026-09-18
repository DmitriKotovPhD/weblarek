import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;
  
  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.basketButton.addEventListener('click', () => {
      eventBroker.emit('cart:show');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = value.toString();
  }
}