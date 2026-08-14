import { ensureElement } from "@/utils/utils";
import { IProductCard, ProductCard } from "./ProductCard";
import { IProduct } from "@/types";

export type IProductCardCatalog = IProductCard &  Pick<IProduct, 'category' | 'image'>;

export class ProductCardCatalog<T extends IProductCardCatalog> extends ProductCard<T> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  
  constructor(container: HTMLElement , data?: IProductCard) {
    super(container);

    this._category = ensureElement<HTMLElement>('.card__category', this.container);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
  }

  set category(value: string) {
    this._category.textContent = value;
  }

  set image(value: HTMLImageElement) {
    this.setImage(this._image, value.src, value.alt);
  }
}