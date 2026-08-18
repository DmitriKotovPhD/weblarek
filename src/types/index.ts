export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    address: string;
    phone: string;
    email: string;
}

export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export const BuyerValidationMessages = {
    payment: 'Выберите способ оплаты',
    address: 'Укажите адрес',
    phone: 'Укажите телефон',
    email: 'Укажите email',
};

export interface IProductListResponse {
    total: number;
    items: IProduct[];
};

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
    name?: string;
    error?: string;
}

export interface IProductEvents {
    click?: (e: MouseEvent) => void;
    addToCart?: () => void;
}