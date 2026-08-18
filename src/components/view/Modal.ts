import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  private _content: HTMLElement;
  private _closeButton: HTMLButtonElement;

  // Открыть модальное окно
  open = (): void => {
    this.container.classList.add('modal_active');

    this.eventBroker.emit('modal:open');
  };

  // Закрыть модальное окно
  close = (): void => {
    this.container.classList.remove('modal_active');
  };

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this._content = ensureElement<HTMLElement>('.modal__content', this.container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    // События
    this.container.addEventListener('click', (e: MouseEvent) => {
      if(e.target === this.container 
      || e.target === this._closeButton) {
        this.close();

        eventBroker.emit('modal:close');
      }
    });
  }

  
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }
}