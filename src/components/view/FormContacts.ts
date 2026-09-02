import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "@/utils/utils";
import { IBuyer, IUIEvents } from "@/types";


export type IFormContacts = Pick<IBuyer, 'email' | 'phone'> & {errors: string[]};

export class FormContacts extends Form<IFormContacts> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents, eventHandlers?: IUIEvents) {
    super(container, eventBroker, eventHandlers);

    this._email = ensureElement<HTMLInputElement>('.form__input[name="email"]', this.container);
    this._phone = ensureElement<HTMLInputElement>('.form__input[name="phone"]', this.container);

    // Подписать поле input на событие ввода данных, с конкретным обработчиком.
    for(const field of [this._email, this._phone]) {
      this.subscribeInputListener(field, () => {
        this.eventBroker.emit<Partial<IBuyer>>('formData:changed', {[field.name]: field.value});
      });
    }
  }

  set email(value: string) {
    this._email.value = value;
  }

  set phone(value: string) {
    this._phone.value = value;
  }
}