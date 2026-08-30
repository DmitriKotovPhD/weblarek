import { IBuyer, IUIEvents, TPayment, isValidPayment } from "@/types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { ensureAllElements, ensureElement } from "@/utils/utils";


export type IFormOrder = Pick<IBuyer, 'payment' | 'address'> & {errors: string[]};


export class FormOrder extends Form<IFormOrder> {
  protected _paymentMethodSelectors: HTMLButtonElement[];
  protected _address: HTMLInputElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents, eventHandlers?: IUIEvents) {
    super(container, eventBroker, eventHandlers);

    this._paymentMethodSelectors = ensureAllElements<HTMLButtonElement>('.order__buttons .button[name]', this.container);
    this._address = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container);

    
    const paymentSelectorsContainer = ensureElement<HTMLElement>('.order__buttons', this.container);

    // Сохранить выделение кнопки метода оплаты в GUI после клика
    paymentSelectorsContainer.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if(!(target instanceof HTMLButtonElement) || 
        !('name' in target)) {
        return;
      }

      const paymentSelected = target.name as TPayment;

      this.eventBroker.emit<Partial<IBuyer>>('formData:changed', {payment: paymentSelected});
    });


    // Подписать поле input на событие ввода данных, с конкретным обработчиком.
    this.subscribeInputListener(this._address, () => {
      this.eventBroker.emit<Partial<IBuyer>>('formData:changed', {[this._address.name]: this._address.value});
    });
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