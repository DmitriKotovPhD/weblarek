import { TPayment, IBuyer, BuyerValidationErrors, isValidPayment, BUYER_FIELDS } from "@/types";
import { BuyerValidationMessages } from "@/utils/constants";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  private validators = new Map<keyof IBuyer | 'default', (value: string) => boolean>();

  constructor(protected eventBroker: IEvents) {
    this.initValidators();
  }

  setData(buyer: Partial<IBuyer>): void {
    BUYER_FIELDS.forEach((key) => {
      if(buyer[key] !== undefined) this[key] = buyer[key];
    });

    this.eventBroker.emit('buyerData:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  // Инициализировать все поля, без вызова события
  private initFields(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  clearAll(): void {
    this.initFields();
    this.eventBroker.emit('buyerData:changed');
  }

  private initValidators(): void {
    this.validators.set('default', (value: string): boolean => {
      return value !== '';
    });

    // Валидация payment
    // В поле payment, пустое значение '' - это тоже часть типа TPayment, 
    // оно означает отсутствие выбранного способа оплаты
    this.validators.set('payment', (value: string): boolean => {
      return value.trim() !== '' && isValidPayment(value.trim());
    });

    // Валидация address
    this.validators.set('address', (value: string): boolean => {
      return value.trim() !== '';
    });

    // Валидация phone
    this.validators.set('phone', (value: string): boolean => {
      return value.trim() !== '';
    });

    // Валидация email
    this.validators.set('email', (value: string): boolean => {
      return value.trim() !== '';
    });
  }

  // Функция валидации полей
  // 1. Если поля (fields) указаны, валидация будет происходить только для указанных полей
  // 2. Если аргумент fields не указан, - валидация будет происходить по всем полям формы.
  validate(fields?: Array<keyof IBuyer>): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};

    const _validateField = (key: keyof IBuyer, value: string) => {
      const validatorKey = this.validators.has(key) ? key : 'default';
      return this.validators.get(validatorKey)!(value);
    };

    const keysToValidate = fields ?? BUYER_FIELDS;

    for(const key of keysToValidate) {
      const value = this[key];

      if(!_validateField(key, value)) {
        const errorKey = key as keyof BuyerValidationErrors;
        errors[errorKey] = BuyerValidationMessages[errorKey];
      }      
    }

    return errors;
  }
}