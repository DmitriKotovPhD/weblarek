import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected _basketButton: HTMLButtonElement;
  protected _counterElement: HTMLElement;
  
  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this._counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
  }

  set counter(value: number) {
    this._counterElement.textContent = value.toString();
  }
}