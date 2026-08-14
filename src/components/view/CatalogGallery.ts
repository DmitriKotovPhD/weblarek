import { ensureElement } from "@/utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ICatalogGallery {
  items: HTMLElement[];
}


export class CatalogGallery extends Component<ICatalogGallery> {
  protected _catalog: HTMLElement;
  
  constructor(container: HTMLElement, protected eventBroker?: IEvents) {
    super(container);

    this._catalog = ensureElement<HTMLElement>('.gallery', this.container);
  }

  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}