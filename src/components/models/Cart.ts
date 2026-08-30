import { IProduct } from "@/types";
import { IEvents } from "../base/Events";

export class Cart {
  private itemsList: IProduct[];

  constructor(protected eventBroker: IEvents) {
    this.itemsList = [];
  }
  
  getItems(): IProduct[] {
    return [...this.itemsList];
  }

  addItem(product: IProduct): void {
    this.itemsList.push(product);
    this.eventBroker.emit('cart:data-changed');
  }

  removeItem(productId: string): void {
    const itemIndex = this.itemsList.findIndex(item => item.id === productId);
    if(itemIndex !== -1) {
      this.itemsList.splice(itemIndex, 1);
      this.eventBroker.emit('cart:data-changed');
    }
  }

  removeAll(): void {
    this.itemsList = [];
    this.eventBroker.emit('cart:data-changed');
  }

  getSubtotal(): number {
    return this.itemsList.reduce((subtotal, item) => subtotal + (item.price ?? 0), 0);
  }

  getItemsCount(): number {
    return this.itemsList.length;
  }

  has(productId: string): boolean {
    return this.itemsList.some(item => item.id === productId);
  }
}