import './scss/styles.scss';
import { Catalog } from '@/components/models/Catalog';
import { Cart } from '@/components/models/Cart';
import { Buyer } from '@/components/models/Buyer';
import { apiProducts } from '@/utils/data';
import { Api } from '@/components/base/Api';
import { API_URL } from '@/utils/constants';
import { BuyerValidationErrors, IProductListResponse } from '@/types';
import { ApiService } from '@/components/models/ApiService';
import { IOrder } from '@/types';


/******** Проверка базового функционала на тестовом наборе данных ********/
/******** Тестирование каталога ********/
console.log('%cТестирование каталога товаров', 'font-weight: bold');
const catalog = new Catalog();
catalog.setProductList( apiProducts.items );
console.log('Вывод всего массива товаров: ');
console.table(catalog.getProductList());

console.log('Получить товар по id "b06cde61-912f-4663-9751-09956c0eed67": ', catalog.getProduct("b06cde61-912f-4663-9751-09956c0eed67"));
console.log('Добавить товар поштучно. см. +1 товар в конце списка:');
catalog.addProduct({
  "id": "a091ab44-bf87-3e49-110a-53aa1762e8b8",
  "description": "Дополнительный секретный товар. Доступен только квалифицированным инвесторам",
  "image": "/Shell.svg",
  "title": "Секретный товар",
  "category": "другое",
  "price": 1770
});
console.table(catalog.getProductList());
console.log('Назначить выбранный товар "854cef69-976d-4c2a-a18c-2aa45046c390"...');
catalog.setSelectedProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log('Получить выбранный товар: ', catalog.getSelectedProduct());


/******** Тестирование корзины ********/
console.log('%cТестирование корзины', 'font-weight: bold');
const cart: Cart = new Cart();
console.log('Добавить 3 товара в корзину...');
cart.addItem( catalog.getProductList()[0] );
cart.addItem( catalog.getProductList()[1] );
cart.addItem( catalog.getProductList()[2] );
console.log('Товары в корзине: ');
console.table( cart.getItems() );
console.log('Количество товаров в корзине: ', cart.getItemsCount());
console.log('Подытог стоимости корзины: ', cart.getSubtotal());
console.log('Наличие существующего товара "854cef69-976d-4c2a-a18c-2aa45046c390" в корзине: ', cart.has("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log('Наличие заведомо ложного товара "wrong000-prod-uct0-a18c-2aa45046c390" в корзине: ', cart.has("wrong000-prod-uct0-a18c-2aa45046c390"));
cart.removeItem("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log('Наличие товара "854cef69-976d-4c2a-a18c-2aa45046c390" после удаления: ', cart.has("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log('Запустить очистку корзины...');
cart.removeAll();
console.log(`Корзина очищена. Количество товаров в корзине: ${cart.getItemsCount()}; Подытог стоимости корзины: ${cart.getSubtotal()}`);
console.log('Содержимое корзины после очистки: ');
console.table( cart.getItems() );

/******** Тестирование работы с данными покупателя ********/
console.log('%cТестирование работы с данными покупателя', 'font-weight: bold');
const buyer = new Buyer();
console.log('Данные покупателя инициализированы:');
console.table( buyer.getData() );
console.log('Валидация пустого объекта данных покупателя:');
console.log(buyer.validate());
console.log('Заполнить данные покупателя частично...');
buyer.setData({
  address: 'Russia, Mira st., 11a',
  phone: '+74950000000',
  email: 'test@yandex.ru'
});
console.log('Данные покупателя после частичного заполнения:');
console.table( buyer.getData() );
console.log('Валидация:');
console.log(buyer.validate());
console.log('Заполнить данные покупателя полностью...');
buyer.setData({
  payment: 'cash',
  address: 'Russia, Mira st., 11a',
  phone: '+74950000000',
  email: 'test@yandex.ru'
});
console.log('Данные покупателя после заполнения:');
console.table( buyer.getData() );
console.log('Валидация:');
console.log(buyer.validate() as BuyerValidationErrors);
console.log('Очистить все поля данных покупателя...');
buyer.clearAll();
console.log('Данные покупателя:');
console.table( buyer.getData() );
console.log('Валидация:');
console.log(buyer.validate());


/******** Тестирование работы с со слоем коммуникации с API ********/
const api = new Api( API_URL );
const apiService = new ApiService(api);
const catalogTestApiService = new Catalog();


/******** Тестирование работы с со слоем коммуникации с API ********/
console.log('Получить все товары через API...');


// Получить товары с сервера
(async () => {
  let requestProducts: IProductListResponse;
  
  try {
    requestProducts = await apiService.getProducts();
  } catch(error) {
    console.log('Ошибка: ', error);
    return;
  }

  console.log('Ответ от API получен:');
  console.table(requestProducts.items);
  console.log('Записать ответ в каталог...');
  catalogTestApiService.setProductList(requestProducts.items);
  console.log('Результат после вставки в каталог: ');
  console.table(catalogTestApiService.getProductList());

  

  // Создать заказ
  console.log('Создать заказ...');
  const buyer2 = new Buyer();
  buyer2.setData({
    payment: 'cash',
    address: 'Russia, Mira st., 11a',
    phone: '+74950000000',
    email: 'test@yandex.ru'
  });


  const cart2 = new Cart();
  console.log('Добавить 2 товара в корзину...');
  cart2.addItem( catalogTestApiService.getProductList()[0] );
  cart2.addItem( catalogTestApiService.getProductList()[1] );
  console.log('Товары в корзине: ');
  console.table( cart2.getItems() );


  const order = <IOrder>Object.assign({
    total: cart2.getSubtotal(),
    items: cart2.getItems().map(item => item.id)
  }, 
  buyer2.getData());

  try {
    const orderResponse = await apiService.createOrder(order);
    console.log('Ответ от API получен:', orderResponse);
  } catch(error) {
    console.log('Ошибка: ', error);
  }

  console.log('ApiService test DONE.');
})();

console.log('READY.....');