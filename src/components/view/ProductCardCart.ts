import { ensureElement } from "@/utils/utils";
import { ProductCard, IProductCard } from "./ProductCard";
import { IProductEvents } from "@/types";

export type IProductCardCart = IProductCard & { index: number };

export class ProductCardCart extends ProductCard<IProductCardCart> {
  protected indexElement: HTMLElement;
  protected buttonDelete: HTMLButtonElement;
  
  constructor(container: HTMLElement, eventHandlers?: IProductEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    // Отдельный обработчик клика для кнопки удаления товара из корзины.
    if(eventHandlers?.removeItem) {
      this.buttonDelete.addEventListener('click', eventHandlers.removeItem);
    }
  }

  // Установить индекс товара в корзине
  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}