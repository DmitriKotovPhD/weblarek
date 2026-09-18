import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IOrderResultSuccess {
  total: number;
}


export class OrderResultSuccess extends Component<IOrderResultSuccess> {
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      eventBroker.emit('success:ok');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}