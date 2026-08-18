import { ensureAllElements, ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T> extends Component<T> {
  protected _fields: HTMLInputElement[];
  protected _actionButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  
  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this._fields = ensureAllElements<HTMLInputElement>('.form__input', this.container);
    this._actionButton = ensureElement<HTMLButtonElement>('.modal__actions [type="submit"]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  validate(): Error[] {
    return [];
  }

  enableActionButton(enable: boolean): void {
    this._actionButton.disabled = !enable;
  }
}