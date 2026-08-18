import { IProduct, IProductEvents } from "@/types";
import { ProductCardCatalog } from "./ProductCardCatalog";
import { IProductCard } from "./ProductCard";
import { ensureElement } from "@/utils/utils";

export type IProductCardFull = Omit<IProduct, 'id'>;

export class ProductCardFull extends ProductCardCatalog<IProductCardFull> {
  protected _description: HTMLElement;
  protected _buttonBuy: HTMLButtonElement;
  
  constructor(container: HTMLElement, eventHandlers?: IProductEvents, data?: IProductCard) {
    super(container, eventHandlers);

    this._description = ensureElement<HTMLElement>('.card__text', this.container);
    this._buttonBuy = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if(eventHandlers?.addToCart) {
      this._buttonBuy.addEventListener('click', eventHandlers.addToCart);
    }
  }

  set description(value: string) {
    this._description.textContent = value;
  }
}