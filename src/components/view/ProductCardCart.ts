import { ensureElement } from "@/utils/utils";
import { ProductCard, IProductCard } from "./ProductCard";
import { IProductEvents } from "@/types";

export type IProductCardCart = IProductCard & { index: number };

export class ProductCardCart extends ProductCard<IProductCardCart> {
  protected _index: HTMLElement;
  protected _buttonDelete: HTMLButtonElement;
  
  constructor(container: HTMLElement, eventHandlers?: IProductEvents) {
    super(container);

    this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this._buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    // Отдельный обработчик клика для кнопки удаления товара из корзины.
    if(eventHandlers?.removeItem) {
      this._buttonDelete.addEventListener('click', eventHandlers.removeItem);
    }
  }

  // Установить индекс товара в корзине
  set index(value: number) {
    this._index.textContent = value.toString();
  }
}