import { TPayment, IBuyer, BuyerValidationErrors, BuyerValidationMessages } from "@/types";

export class Buyer {
  private payment: TPayment;
  private address: string;
  private phone: string;
  private email: string;

  constructor() {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  setData(buyer: Partial<IBuyer>): void {
    Object.assign(this, buyer);
  }

  getData(): IBuyer {
    return Object.assign(<IBuyer>{}, this);
  }

  clearAll(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};

    for(const [key, value] of Object.entries(this)) {
      if(value === '') {
        const _key = key as keyof BuyerValidationErrors;
        errors[_key] = BuyerValidationMessages[_key];
      }
    }

    return errors;
  }
}