import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";

export interface IProductCard {
  title: string;
  price: number | null;
}

export abstract class ProductCard<T extends IProductCard> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  
  constructor(container: HTMLElement, data?: IProductCard) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', this.container);
    this._price = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}