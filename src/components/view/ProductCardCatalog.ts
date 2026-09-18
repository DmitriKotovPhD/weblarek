import { ensureElement } from "@/utils/utils";
import { IProductCard, ProductCard } from "./ProductCard";
import { IProduct, IProductEvents } from "@/types";
import { categoryMap } from "@/utils/constants";

export type IProductCardCatalog = IProductCard & Pick<IProduct, 'category' | 'image'>;

type CategoryName = keyof typeof categoryMap;

export class ProductCardCatalog<T extends IProductCardCatalog> extends ProductCard<T> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  
  constructor(container: HTMLElement, eventHandlers?: IProductEvents) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    // Обработка клика на контейнере.
    // TODO: 
    // - переместить всю обработку кликов внутри контейнера внутрь единого обработчика кликов на контейнере, 
    // и расположить его в родительском классе ProductCard
    // - в классах-наследниках, декорировать, добавлять элементы в список обработки
    // 
    if(eventHandlers?.click) {
      this.container.addEventListener('click', eventHandlers.click);
    }
  }

  // Установить текст наименования категории товара
  set category(value: string) {
    this.categoryElement.textContent = value;

    this.updateCardBackground(value);
  }

  // Установить изображение
  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement?.textContent || '');
  }

  protected updateCardBackground(category: string) {
    // Удалить все категории из списка классов элемента, и назначить/оставить только выбранную категорию, если она задана
    for(const name in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[name as CategoryName], name === category);
    }
  }
}