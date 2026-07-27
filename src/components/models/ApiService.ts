import { IApi, IProductListResponse, IOrderResponse, IOrder, TResponseError } from "@/types";

export class ApiService {
  constructor(private api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductListResponse | TResponseError> {
    try{
      return await this.api.get<IProductListResponse>('/product/');
    } catch(error) {
      debugger;
      return { error } as TResponseError;
    }
  }

  async createOrder(order: IOrder): Promise<IOrderResponse | TResponseError> {
    try{
      return await this.api.post<IOrderResponse>('/order/', order);
    } catch(error) {
      return { error } as TResponseError;
    }
  }
}