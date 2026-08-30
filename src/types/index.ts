export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Payment methods
const PAYMENTS_MAP = {
    card: 'card',
    cash: 'cash',
    none: ''
};

export type TPayment = typeof PAYMENTS_MAP[keyof typeof PAYMENTS_MAP];

const VALID_PAYMENT_SET = new Set(Object.values(PAYMENTS_MAP));

export function isValidPayment(value: unknown): value is TPayment {
    return typeof value === 'string' && VALID_PAYMENT_SET.has(value);
}


export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment?: TPayment;
    address?: string;
    phone?: string;
    email?: string;
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
    actionButtonClick?: () => void;       // add to cart
    removeItem?: () => void;    // remove item from cart
}

export interface ICheckoutEvents {
    checkout?: () => void;
}

export interface IUIEvents {
    submit?: (e: Event) => void;
    input?: () => void;
    click?: () => void;
}
