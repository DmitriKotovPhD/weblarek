import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "@/utils/utils";
import { IBuyer } from "@/types";


export type IFormContacts = Pick<IBuyer, 'email' | 'phone'> & {actionButtonEnabled: boolean, errors: string[]};

export class FormContacts extends Form<IFormContacts> {
  protected emailField: HTMLInputElement;
  protected phoneField: HTMLInputElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container, eventBroker);

    this.emailField = ensureElement<HTMLInputElement>('.form__input[name="email"]', this.container);
    this.phoneField = ensureElement<HTMLInputElement>('.form__input[name="phone"]', this.container);

    // Обработчик события отправки формы
    this.container.addEventListener('submit', () => {
      eventBroker.emit('contacts:submit');
    });

    // Подписать поле input на событие ввода данных, с конкретным обработчиком.
    for(const field of [this.emailField, this.phoneField]) {
      this.subscribeInputListener(field, () => {
        this.eventBroker.emit<Partial<IBuyer>>('formData:changed', {[field.name]: field.value});
      });
    }
  }

  set email(value: string) {
    this.emailField.value = value;
  }

  set phone(value: string) {
    this.phoneField.value = value;
  }
}