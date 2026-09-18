import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";

export interface IProductCard {
  title: string;
  price: number | null;
}

export abstract class ProductCard<T extends IProductCard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  
  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}