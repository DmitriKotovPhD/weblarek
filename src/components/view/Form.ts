import { ensureAllElements, ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IUIEvents } from "@/types";

export abstract class Form<T> extends Component<T> {
  protected _fields: HTMLInputElement[];
  protected _actionButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  protected _subscribersInput: Map<string, Function>;
  
  constructor(container: HTMLElement, protected eventBroker: IEvents, eventHandlers?: IUIEvents) {
    super(container);

    this._fields = ensureAllElements<HTMLInputElement>('.form__input', this.container);
    this._actionButton = ensureElement<HTMLButtonElement>('.modal__actions [type="submit"]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
    
    // Карта подписки полей с типом input, на событие ввода данных, в формате "элемент <-> обработчик"
    // Один слушатель события ввода в поля input
    this._subscribersInput = new Map();

    // Обработчик события отправки формы
    if(eventHandlers?.submit) {
      // this._actionButton.addEventListener('click', eventHandlers.submit);
      this.container.addEventListener('submit', (e: Event) => { if(eventHandlers?.submit) eventHandlers.submit(e) });
    }

    // Обработка события input для всех полей input
    // единым обработчиком, прицепленным на контейнер
    this.container.addEventListener('input', (e: InputEvent) => {
      const target = e.target as HTMLInputElement;

      if(!(target instanceof HTMLInputElement) ||
         !('name' in target)) {
        return false;
      }

      this.handleInput(target.name.toString(), e);
    });
  }

  // Прокси обработки события input 
  handleInput(name: string, e: InputEvent): void {
    if(this._subscribersInput.has(name)) {
      // Обработчик события для конкретного элемента, на котором событие произошло
      const handler = this._subscribersInput.get(name)!;
      handler();
    }
  }

  subscribeInputListener(input: HTMLInputElement, handler: Function) {
    const name = input?.name.toString();
    if(name) {
      this._subscribersInput.set(name, handler);
    }
  }

  // Вывод текста ошибок в UI
  set errors(errors: string[]) {
    this._errors.textContent = errors.join(" , ");
  }

  // Включить-выключить кнопку действия (отправки) формы
  enableActionButton(enable: boolean): void {
    this._actionButton.disabled = !enable;
  }
}