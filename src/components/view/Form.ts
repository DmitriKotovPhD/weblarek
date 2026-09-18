import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T> extends Component<T> {
  protected actionButton: HTMLButtonElement;
  protected errorsField: HTMLElement;

  protected subscribersInput: Map<string, Function>;
  
  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.actionButton = ensureElement<HTMLButtonElement>('.modal__actions [type="submit"]', this.container);
    this.errorsField = ensureElement<HTMLElement>('.form__errors', this.container);
    
    // Карта подписки полей с типом input, на событие ввода данных, в формате "элемент <-> обработчик"
    // Один слушатель события ввода в поля input
    this.subscribersInput = new Map();

    // Обработчик события отправки формы
    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
    });
    

    // Обработка события input для всех полей input
    // единым обработчиком, прицепленным на контейнер
    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;

      if(!(target instanceof HTMLInputElement) ||
         !('name' in target)) {
        return;
      }

      this.handleInput(target.name.toString());
    });
  }


  // Прокси обработки события input 
  handleInput(name: string): void {
    if(this.subscribersInput.has(name)) {
      // Обработчик события для конкретного элемента, на котором событие произошло
      const handler = this.subscribersInput.get(name)!;
      handler();
    }
  }

  // Подписка слушателя на событие input поля input
  // ВНИМАНИЕ: на одно поле только один слушатель. 
  // ВАЖНО: в форме не может быть двух полей с одинаковыми именами
  subscribeInputListener(input: HTMLInputElement, handler: Function) {
    const name = input?.name.toString();
    if(name) {
      this.subscribersInput.set(name, handler);
    }
  }

  // Вывод текста ошибок в UI
  set errors(errors: string[]) {
    this.errorsField.textContent = errors.join(" , ");
  }

  // Включить-выключить кнопку действия (отправки) формы
  set actionButtonEnabled(enabled: boolean) {
    this.actionButton.disabled = !enabled;
  }
}