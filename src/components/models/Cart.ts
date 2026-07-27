import { IProduct } from "@/types";

export class Cart {
  private itemsList: IProduct[];

  constructor() {
    this.itemsList = [];
  }
  
  getItems(): IProduct[] {
    return [...this.itemsList];
  }

  addItem(product: IProduct): void {
    this.itemsList.push(product);
  }

  removeItem(productId: string): void {
    const itemIndex = this.itemsList.findIndex(item => item.id === productId);
    if(itemIndex !== -1) {
      this.itemsList.splice(itemIndex, 1);
    }
  }

  removeAll(): void {
    this.itemsList = [];
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