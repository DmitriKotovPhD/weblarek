import { Component } from "../base/Component";

export interface ICatalogGallery {
  items: HTMLElement[];
}


export class CatalogGallery extends Component<ICatalogGallery> {
  
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}