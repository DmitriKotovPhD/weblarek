import { IProduct } from '@/types';

export class Catalog {
  private productList: IProduct[];
  private selectedProduct: IProduct | null;

  constructor() { 
    this.productList = [];
    this.selectedProduct = null;
  }

  getProductList(): IProduct[] {
    return [...this.productList];
  }

  setProductList(products: IProduct[]): void {
    this.productList = products;
  }

  getProduct(productId: string) : IProduct | null {
    return this.productList.find(product => product.id === productId) ?? null;
  }

  addProduct(product: IProduct): void {
    this.productList.push(product);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  setSelectedProduct(productId: string): void {
    this.selectedProduct = this.getProduct(productId);
  }
}