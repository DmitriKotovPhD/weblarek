import './scss/styles.scss';
import { API_URL, CDN_URL } from '@/utils/constants';
import { Api } from '@/components/base/Api';
import { apiProducts } from '@/utils/data';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Catalog } from '@/components/models/Catalog';
import { Cart } from '@/components/models/Cart';
import { Buyer } from '@/components/models/Buyer';
import { BuyerValidationErrors, IProductListResponse, IProduct, IOrder, IBuyer, IOrderResponse } from '@/types';
import { ApiService } from '@/components/models/ApiService';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/view/Header';
import { CatalogGallery } from './components/view/CatalogGallery';
import { Modal } from './components/view/Modal';
import { IProductCardFull, ProductCardFull } from './components/view/ProductCardFull';
import { ProductCardCatalog } from './components/view/ProductCardCatalog';
import { CartView } from './components/view/CartView';
import { ProductCardCart } from './components/view/ProductCardCart';
import { Form } from './components/view/Form';
import { IFormOrder, FormOrder } from './components/view/FormOrder';
import { FormContacts, IFormContacts } from './components/view/FormContacts';
import { OrderResultSuccess } from './components/view/OrderResultSuccess';


// APP MAIN CODE
const api = new Api(API_URL);
const apiService = new ApiService(api);

const eventBroker = new EventEmitter();

const catalog = new Catalog(eventBroker);
const buyer = new Buyer(eventBroker);
const cart = new Cart(eventBroker);


// Elements
const headerContainer = ensureElement<HTMLElement>('.header__container');
const catalogGalleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');


// Templates
const productCardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productCardFullTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productCardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderResultSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');


// Fetch templates content
const productCardFullContent = cloneTemplate(productCardFullTemplate);
const cartContent = cloneTemplate(cartTemplate);
const formOrderContent = cloneTemplate(formOrderTemplate);
const formContactsContent = cloneTemplate(formContactsTemplate);
const orderResultSuccessContent = cloneTemplate(orderResultSuccessTemplate);


// View
const headerView = new Header(headerContainer, eventBroker);
const catalogGalleryView = new CatalogGallery(catalogGalleryContainer, eventBroker);
const modalView = new Modal(modalContainer, eventBroker);
const cartView = new CartView(cartContent, eventBroker);
const formOrder = new FormOrder(formOrderContent, eventBroker, {
  submit: (e: Event) => {
    e.preventDefault();
    eventBroker.emit('order:submit');
  }
});
const formContacts = new FormContacts(formContactsContent, eventBroker, {
  submit: (e: Event) => {
    e.preventDefault();
    eventBroker.emit('contacts:submit');
  },
});
const orderResultSuccess = new OrderResultSuccess(orderResultSuccessContent, eventBroker);


// Представление полной карточки товара
const productCardFullView = new ProductCardFull(productCardFullContent, {
  actionButtonClick: () => {
    eventBroker.emit('cart:add');
  }
});


// Обработчик события кнопки действия с товаром 
// (кнопка добавить/удалить  вкарточке товара):
// - добавить товар в корзину
// - либо удалить товар из корзины
eventBroker.on('cart:add', () => {
  const product = catalog.getSelectedProduct();
  
  if(!product) return;

  // Удалить товар по нажатию. Иначе добавить товар по нажатию.
  // Если в корзине уже есть товар, то пользователь видит кнопку удаления. 
  if(cart.has(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }

  modalView.close();
});


// Обработчик события изменения состава корзины
// Обновить представление корзины в соответствии с актуальными данными
eventBroker.on('cart:data-changed', () => {
  headerView.counter = cart.getItemsCount();

  cartView.render({items: cart.getItems().map((item, index) => {
    const itemCard = new ProductCardCart(
      cloneTemplate(productCardCartTemplate), 
      {
        removeItem: () => {
          eventBroker.emit('cart:remove', {id: item.id});
        }
    });

    return itemCard.render({
      index: index + 1,
      title: item.title,
      price: item.price
    });
  })});

  cartView.subtotalContent = cart.getSubtotal();
  cartView.checkoutEnabled = !!cart.getItemsCount();

  // optionally: re-render modal view
});


// Обработчик события удаления товара из корзины
eventBroker.on<Pick<IProduct, 'id'>>('cart:remove', ({ id }) => {
  cart.removeItem(id);
});



// Обработчик события: показать корзину
eventBroker.on('cart:show', () => {
  modalView.render({content: cartView.render()});
  modalView.open();
});  


eventBroker.on<IFormOrder>('cart:submit', () => {
    modalView.close();
    
    // Предположим, мы загрузили где-то данные модели buyer из localStorage, из кэша.
    // Побережём мозг нетренированного пользователя, чтобы он не заморачивался с данными, и быстрее купил:)
    const { payment, address } = buyer.getData();
    formOrder.render({ payment, address });

    modalView.render({content: formOrder.render({errors: []})});

    // Пусть здесь будут моковые данные, для начала. Я так хочу.
    buyer.setData({
      payment: "cash",
      address: "Россия, Москва, ул.Льва Толстого, 16"
    });

    modalView.open();
});



eventBroker.on('formData:changed', (data: Partial<IBuyer>) => {
  buyer.setData(data);
});


// Обновить только ту форму, которой касается обновление
// eventBroker.on<Array<keyof IBuyer>>('buyerData:changed', (keys: Array<keyof IBuyer>) => {
//  const errors = buyer.validate(keys);
//  updateFormState(formsDataMap.get(keys.join('')), errors);
// });



// Как только данные изменились, валидировать их и отобразить результат в интерфейсе
// TODO: использовать changedKeys
eventBroker.on<Array<keyof IBuyer>>('buyerData:changed', (changedKeys) => {

  // Валидация модели данных и вывод сообщений об ошибках
  // TODO: сопоставлять changedKeys и список полей в конкретной форме. Чтобы валидировать ошибки только по задействованным полям.
  const orderErrors = getErrorsText(buyer.validate(['payment', 'address']));
  const contactsErrors = getErrorsText(buyer.validate(['phone', 'email']));

  updateFormState(formOrder, orderErrors);
  updateFormState(formContacts, contactsErrors);
});


// Получить тексты ошибок из объекта валидации
function getErrorsText(errors: BuyerValidationErrors) {
  return Object.values(errors).filter(Boolean);
}


// Обновить состояние формы: отрисовать ошибки, и обновить состояние кнопки действия
function updateFormState(form: Form<IFormOrder | IFormContacts>, errors: string[]) {
  const buyerData = buyer.getData();

  // Определяем, какая это форма, и берём только нужные поля
  let dataToRender: Partial<IFormOrder> | Partial<IFormContacts>;

    if (form instanceof FormOrder) {
    const { payment, address } = buyerData;
    dataToRender = { payment, address };
  } else {
    // Предполагаем, что вторая форма — FormContacts
    const { phone, email } = buyerData;
    dataToRender = { phone, email };
  }

  form.render(dataToRender);
  form.render({errors});
  form.enableActionButton(!errors.length);
}


// Обработчик события изменения состава каталога
// Обновить представление каталога в соответствии с актуальными данными
eventBroker.on('catalog:data-changed', (e) => {
  const productCards = catalog.getProductList().map(product => {
    const productCardCatalogContent = cloneTemplate(productCardCatalogTemplate);

    // Карточка каталога, и обработчик(и) событий карточки
    const productCard = new ProductCardCatalog(productCardCatalogContent, {
      click: (e) => {
        eventBroker.emit('catalog:item-click', product);
      }
    });
    
    // Прописать правильную базовую часть пути к картинке товара
    product.image = `${CDN_URL}${product.image}`;

    const { title, price, category, image } = product;
    return productCard.render({ title, price, category, image });
  });

  catalogGalleryView.items = productCards;
});



// Обработчик события клика на карточку товара в каталоге
eventBroker.on<IProduct>('catalog:item-click', (product: IProduct) => {
  catalog.setSelectedProduct(product.id);
});


// Обработчик события выбора товара в каталоге
eventBroker.on<IProduct>('catalog:select', () => {
  renderProductCardFullView();
});



// Показать модальное окно с подробным описанием товара
const renderProductCardFullView = () => {
  // Вспомогательная функция: обновить надпись кнопки действия карточки товара
  const updateActionButton = (card: ProductCardFull, product: IProduct, cart: Cart) : void => {
    if(null === product.price) {
      card.actionButtonText = 'Недоступно';
      card.actionButtonEnabled = false;
      return;
    }

    card.actionButtonEnabled = true;
    card.actionButtonText = cart.has(product.id) ? 
    'Удалить из корзины' : 
    'Купить';
  };


  const product = catalog.getSelectedProduct();

  if(!product) return;

  const { title, description, image, category, price } = product;
  productCardFullView.render({ title, description, image, category, price });
  
  updateActionButton(productCardFullView, product, cart);

  modalView.render({content: productCardFullView.render()});

  modalView.open();
};


// По событию отправки формы с данными о способе оплаты и адреса, открыть следующую форму
eventBroker.on('order:submit', () => {
  modalView.render({content: formContacts.render({errors: []})});
});

// Обработчик события отправки формы с контактами
eventBroker.on('contacts:submit', () => {
    const order = <IOrder>Object.assign({
      total: cart.getSubtotal(),
      items: cart.getItems().map(item => item.id)
    }, 
    buyer.getData());

    (async () => {
      try {
        const orderResponse = await apiService.createOrder(order);
        
        cart.removeAll();
        buyer.clearAll();

        eventBroker.emit<IOrderResponse>('order:success', {
          id: orderResponse.id,
          total: orderResponse.total
        });
      } catch(error) {
        console.error('Ошибка: ', error);
      }
    })();
});


// Показать окно с уведомлением об успешном размещении заказа
eventBroker.on('order:success', (response: IOrderResponse) => {
  modalView.render({content: orderResultSuccess.render({ total: response.total })});
});


eventBroker.on('success:ok', () => {
  modalView.close();
});


// Init
(async() => {
  let productsList: IProductListResponse;

  try {
    productsList = await apiService.getProducts();
    catalog.setProductList(productsList.items);
    
  } catch(error) {
    console.error('Ошибка: ', error);
    throw error;
  }
})();
