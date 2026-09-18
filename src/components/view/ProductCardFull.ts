import { IProduct } from "@/types";
import { ProductCardCatalog } from "./ProductCardCatalog";
import { ensureElement } from "@/utils/utils";
import { IEvents } from "../base/Events";

export type IProductCardFull = Omit<IProduct, 'id'> & { actionButtonText: string, actionButtonEnabled: boolean };

// Согласно логике данного проекта, логично сделать наследование от карточки каталога
// При необходимости, обработчики событий можно как свести воедино, так и развести в отдельную логику, - это удобно.
export class ProductCardFull extends ProductCardCatalog<IProductCardFull> {
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    // Пусть у кнопки покупки будет свой отдельный обработчик
    this.actionButton.addEventListener('click', () => {
      eventBroker.emit('cart:action');
    });
  }

  // Установить текст поля описания товара
  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  // Установить текст кнопки действия на полной карточке товара
  set actionButtonText(value: string) {
    this.actionButton.textContent = value;
  }

  // Вкл-выкл кнопки действия
  set actionButtonEnabled(enabled: boolean) {
    this.actionButton.disabled = !enabled;
  }
}