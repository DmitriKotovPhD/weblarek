import { ensureElement } from "@/utils/utils";
import { IProductCard, ProductCard } from "./ProductCard";
import { IProduct, IProductEvents } from "@/types";

export type IProductCardCatalog = IProductCard &  Pick<IProduct, 'category' | 'image'>;

export class ProductCardCatalog<T extends IProductCardCatalog> extends ProductCard<T> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  
  constructor(container: HTMLElement, eventHandlers?: IProductEvents, data?: IProductCard) {
    super(container);

    this._category = ensureElement<HTMLElement>('.card__category', this.container);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.container);

    if(eventHandlers?.click) {
      this.container.addEventListener('click', eventHandlers.click);
    }
  }

  set category(value: string) {
    this._category.textContent = value;
  }

  set image(value: string) {
    this.setImage(this._image, value, this._title?.textContent || '');
  }
}