import { ensureElement } from "@/utils/utils";
import { ProductCard, IProductCard } from "./ProductCard";

export type IProductCardCart = IProductCard & { index: number };

export class ProductCardCart extends ProductCard<IProductCardCart> {
  protected _index: HTMLElement;
  protected _buttonDelete: HTMLButtonElement;
  
  constructor(container: HTMLElement, data?: IProductCard) {
    super(container);

    this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this._buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
  }

  set index(value: number) {
    this._index.textContent = value.toString();
  }
}