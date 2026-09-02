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
    email?: string;
    phone?: string;
    address?: string;
}

export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;


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

// Интерфейс событий с карточкой товара
export interface IProductEvents {
    click?: (e: MouseEvent) => void;    // событие клика (по контейнеру, либо по элементу)
    actionButtonClick?: () => void;     // клик по кнопке действия. Выведено в отдельную категорию события для удобства.
    removeItem?: () => void;            // удалить товар из  корзины
}

// Интерфейс событий с формами
export interface IUIEvents {
    submit?: (e: Event) => void;        // событие отправки формы
    input?: () => void;                 // событие input для интерактивной отработки событий формы
    click?: () => void;                 // событие клика (по контейнеру, либо по элементу)
}
