import { IProduct, IProductEvents } from "@/types";
import { ProductCardCatalog } from "./ProductCardCatalog";
import { ensureElement } from "@/utils/utils";

export type IProductCardFull = Omit<IProduct, 'id'>;

export class ProductCardFull extends ProductCardCatalog<IProductCardFull> {
  protected _description: HTMLElement;
  protected _actionButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, eventHandlers?: IProductEvents) {
    super(container);

    this._description = ensureElement<HTMLElement>('.card__text', this.container);
    this._actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    // Пусть у кнопки покупки будет свой отдельный обработчик
    if(eventHandlers?.actionButtonClick) {
      this._actionButton.addEventListener('click', eventHandlers.actionButtonClick);
    }
  }

  // Установить текст поля описания товара
  set description(value: string) {
    this._description.textContent = value;
  }

  // Установить текст кнопки действия на полной карточке товара
  set actionButtonText(value: string) {
    if(!value) return;

    this._actionButton.textContent = value;
  }

  // Вкл-выкл кнопки действия
  set actionButtonEnabled(enabled: boolean) {
    this._actionButton.disabled = !enabled;
  }
}