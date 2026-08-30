import { ensureElement } from "@/utils/utils";
import { IProductCard, ProductCard } from "./ProductCard";
import { IProduct, IProductEvents } from "@/types";
import { categoryMap } from "@/utils/constants";

export type IProductCardCatalog = IProductCard & Pick<IProduct, 'category' | 'image'>;

export class ProductCardCatalog<T extends IProductCardCatalog> extends ProductCard<T> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  
  constructor(container: HTMLElement, eventHandlers?: IProductEvents) {
    super(container);

    this._category = ensureElement<HTMLElement>('.card__category', this.container);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.container);

    // Обработка клика на контейнере.
    // TODO: 
    // - переместить всю обработку кликов внутри контейнера внутрь единого обработчика кликов на контейнере, 
    // и расположить его в родительском классе ProductCard
    // - в классах-наследниках, декорировать, добавлять элементы в список обработки
    // 
    // Но пока пусть будет так.
    if(eventHandlers?.click) {
      this.container.addEventListener('click', eventHandlers.click);
    }
  }

  // Установить текст наименования категории товара
  set category(value: string) {
    this._category.textContent = value;

    this.updateCardBackground(value);
  }

  // Установить изображение
  set image(value: string) {
    this.setImage(this._image, value, this._title?.textContent || '');
  }

  protected updateCardBackground(category: string) {
    const customBackground = Object.hasOwn(categoryMap, category) ? {...categoryMap}[category] : undefined;
    if(customBackground) {
      this._category.classList.replace(this._category.classList[1], customBackground);
    }
  }
}