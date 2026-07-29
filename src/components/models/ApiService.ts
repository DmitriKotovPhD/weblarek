import { IApi, IProductListResponse, IOrderResponse, IOrder } from "@/types";

export class ApiService {
  constructor(private api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductListResponse> {
    return await this.api.get<IProductListResponse>('/product/');
  }

  async createOrder(order: IOrder): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>('/order/', order);
  }
}