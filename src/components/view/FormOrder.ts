import { IBuyer, TPayment } from "@/types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { ensureAllElements, ensureElement } from "@/utils/utils";


export type IFormOrder = Pick<IBuyer, 'payment' | 'address'> & {actionButtonEnabled: boolean, errors: string[]};


export class FormOrder extends Form<IFormOrder> {
  protected paymentMethodSelectors: HTMLButtonElement[];
  protected addressField: HTMLInputElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container, eventBroker);

    this.paymentMethodSelectors = ensureAllElements<HTMLButtonElement>('.order__buttons .button[name]', this.container);
    this.addressField = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container);

    // Обработчик события отправки формы
    this.container.addEventListener('submit', () => {
      eventBroker.emit('order:submit');
    });
    
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
    this.subscribeInputListener(this.addressField, () => {
      this.eventBroker.emit<Partial<IBuyer>>('formData:changed', {[this.addressField.name]: this.addressField.value});
    });
  }

  
  set payment(value: TPayment) {    
    this.paymentMethodSelectors.forEach(el => {
      if(el.name === value) {
        el.classList.add('button_alt-active');
      } else {
        el.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this.addressField.value = value;
  }
}