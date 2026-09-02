import { TPayment, IBuyer, BuyerValidationErrors, isValidPayment } from "@/types";
import { BuyerValidationMessages } from "@/utils/constants";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  private _validators = new Map<string, Function>();

  constructor(protected eventBroker: IEvents) {
    this.clearAll();
    this.initValidators();
  }

  setData(buyer: Partial<IBuyer>): void {
    Object.assign(this, buyer);
    const changedKeys = Object.keys(buyer) as Array<keyof this>;
    this.eventBroker.emit('buyerData:changed', changedKeys);
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearAll(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  initValidators(): void {
    this._validators.set('default', (value: string) => {
      return value !== '';
    });

    // Валидация payment
    // В поле payment, пустое значение '' - это тоже часть типа TPayment, 
    // оно означает отсутствие выбранного способа оплаты
    this._validators.set('payment', (): Boolean => {
      return this.payment.trim() !== '' && isValidPayment(this.payment.trim());
    });

    // Валидация address
    this._validators.set('address', () => {
      return this.address.trim().length > 0;
    });

    // Валидация phone
    this._validators.set('phone', () => {
      const pattern = /^(?:\+7|8)?[\s\-()]*\d{3}[\s\-()]*\d{3}[\s\-()]*\d{2}[\s\-()]*\d{2}$/;
      return pattern.test(this.phone.trim());
    });

    // Валидация email
    this._validators.set('email', () => {
      const email = this.email.trim();

      if(email.length > 254) {
        return false;
      }

      const pattern = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
      if(!pattern.test(email)) {
        return false;
      }
      
      // Проверка на наличие двойных точек и двойных дефисов: это недопустимо
      if(/[-\.]{2,}/.test(email)) {
        return false;
      }

      const [local, domain] = email.split('@');

      if(local.length > 64) {
        return false;
      }

      if(local.startsWith('.') || local.endsWith('.') ||
         local.startsWith('-') || local.endsWith('-')) {
        return false;
      }

      if(domain.startsWith('.') || domain.endsWith('.') ||
         domain.startsWith('-') || domain.endsWith('-')) {
        return false;
      }

      return true;
    });
  }

  // Функция валидации полей
  // 1. Если поля (fields) указаны, валидация будет происходить только для указанных полей
  // 2. Если аргумент fields не указан, - валидация будет происходить по всем полям формы.
  validate(fields?: Array<keyof IBuyer>): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};

    const _validateField = (key: keyof IBuyer, value: string, errors: BuyerValidationErrors) => {
      const validatorKey = this._validators.has(key) ? key : 'default';
      return this._validators.get(validatorKey)!(value);
    };

    const keysToValidate = fields ?? Object.keys(this) as Array<keyof IBuyer>;

    for(const key of keysToValidate) {
      const value = this[key];

      if(!_validateField(key, value, errors)) {
        const errorKey = key as keyof BuyerValidationErrors;
        errors[errorKey] = BuyerValidationMessages[errorKey];
      }      
    }

    return errors;
  }
}