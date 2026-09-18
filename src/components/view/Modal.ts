import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;
 

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    // События
    this.container.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Element;
      
      if(!target) return;

      if(target === this.container ||
         this.closeButton.contains(target)) {
          e.stopPropagation();
          this.close();
      }
    });
  }

  // Открыть модальное окно
  open = (): void => {
    this.container.classList.add('modal_active');
  };

  // Закрыть модальное окно
  close = (): void => {
    this.container.classList.remove('modal_active');
  };

  // Установить дочерний контент модального окна
  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }
}