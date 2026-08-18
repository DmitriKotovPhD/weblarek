import { IProduct } from '@/types';
import { IEvents } from '../base/Events';

export class Catalog {
  private productList: IProduct[];
  private selectedProduct: IProduct | null;

  constructor(protected eventBroker: IEvents) { 
    this.productList = [];
    this.selectedProduct = null;
  }

  getProductList(): IProduct[] {
    return [...this.productList];
  }

  setProductList(products: IProduct[]): void {
    this.productList = products;

    this.eventBroker.emit('catalog:data-changed');
  }

  getProduct(productId: string) : IProduct | null {
    return this.productList.find(product => product.id === productId) ?? null;
  }

  addProduct(product: IProduct): void {
    this.productList.push(product);

    this.eventBroker.emit('catalog:data-changed');
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  setSelectedProduct(productId: string): void {
    this.selectedProduct = this.getProduct(productId);

    this.eventBroker.emit('catalog:select');
  }
}