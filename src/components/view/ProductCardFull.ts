import { IProduct } from "@/types";
import { ProductCardCatalog } from "./ProductCardCatalog";
import { IProductCard } from "./ProductCard";
import { ensureElement } from "@/utils/utils";

export type IProductCardFull = Omit<IProduct, 'id'>;

export class ProductCardFull extends ProductCardCatalog<IProductCardFull> {
  protected _description: HTMLElement;
  protected _buttonBuy: HTMLButtonElement;
  
  constructor(container: HTMLElement, data?: IProductCard) {
    super(container);

    this._description = ensureElement<HTMLElement>('.card__text', this.container);
    this._buttonBuy = ensureElement<HTMLButtonElement>('.card__button', this.container);
  }

  set description(value: string) {
    this._description.textContent = value;
  }
}