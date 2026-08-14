import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "@/utils/utils";

export interface IFormContacts {
  email: string;
  phone: string;
}


export class FormContacts extends Form<IFormContacts> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container, eventBroker);

    this._email = ensureElement<HTMLInputElement>('.form__input [name="email"]', this.container);
    this._phone = ensureElement<HTMLInputElement>('.form__input [name="phone"]', this.container);
  }

  set email(value: string) {
    this._email.textContent = value;
  }

  set phone(value: string) {
    this._phone.textContent = value;
  }
}