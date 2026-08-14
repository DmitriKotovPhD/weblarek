import { TPayment } from "@/types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { ensureAllElements, ensureElement } from "@/utils/utils";


export interface IFormOrder {
  payment: TPayment;
  address: string;
}

export class FormOrder extends Form<IFormOrder> {
  protected _paymentMethodSelectors: HTMLButtonElement[];
  protected _address: HTMLInputElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container, eventBroker);

    this._paymentMethodSelectors = ensureAllElements<HTMLButtonElement>('.order__buttons .button[name]', this.container);
    this._address = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container);
  }

  set payment(value: TPayment) {
    this._paymentMethodSelectors.forEach(el => {
      if(el.name === value) {
        el.classList.add('button_alt-active');
      } else {
        el.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this._address.value = value;
  }
}