import { ensureAllElements, ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IOrderResultSuccess {

}


export class OrderResultSuccess extends Component<IOrderResultSuccess> {
  private _title: HTMLElement;
  private _description: HTMLElement;
  private _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this._title = ensureElement<HTMLElement>('.order-success__title', this.container);
    this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
  }

  set total(value: number) {
    this._description.textContent = `Списано ${value} синапсов`;
  }
}