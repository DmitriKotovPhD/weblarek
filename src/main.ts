import './scss/styles.scss';
import { API_URL, CDN_URL } from '@/utils/constants';
import { Api } from '@/components/base/Api';
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
import { ProductCardFull } from './components/view/ProductCardFull';
import { ProductCardCatalog } from './components/view/ProductCardCatalog';
import { CartView } from './components/view/CartView';
import { ProductCardCart } from './components/view/ProductCardCart';
import { IFormOrder, FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
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
const catalogGalleryView = new CatalogGallery(catalogGalleryContainer);
const modalView = new Modal(modalContainer, eventBroker);
const cartView = new CartView(cartContent, eventBroker);
const formOrder = new FormOrder(formOrderContent, eventBroker);
const formContacts = new FormContacts(formContactsContent, eventBroker);
const orderResultSuccess = new OrderResultSuccess(orderResultSuccessContent, eventBroker);


// Представление полной карточки товара
const productCardFullView = new ProductCardFull(productCardFullContent, eventBroker);


// Обработчик события кнопки действия с товаром 
// (кнопка добавить/удалить  вкарточке товара):
// - добавить товар в корзину
// - либо удалить товар из корзины
eventBroker.on('cart:action', () => {
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
  headerView.render({counter: cart.getItemsCount()});

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
  }),
  subtotal: cart.getSubtotal(),
  checkoutEnabled: !!cart.getItemsCount()
  });
});


// Обработчик события удаления товара из корзины
eventBroker.on<Pick<IProduct, 'id'>>('cart:remove', ({ id }) => {
  cart.removeItem(id);
});



// Обработчик события: показать корзину
eventBroker.on('cart:show', () => {
  modalView.render({content: cartView.render({checkoutEnabled: !!cart.getItemsCount()})});
  modalView.open();
});  


eventBroker.on<IFormOrder>('cart:submit', () => {
    modalView.close();
    
    const { payment, address } = buyer.getData();

    modalView.render({content: formOrder.render({payment, address, errors: []})});

    modalView.open();
});



eventBroker.on('formData:changed', (data: Partial<IBuyer>) => {
  buyer.setData(data);
});


// Как только данные изменились, валидировать их и отобразить результат в интерфейсе
// TODO: использовать changedKeys как аргумент функции
eventBroker.on<Array<keyof IBuyer>>('buyerData:changed', () => {

  // Валидация модели данных и вывод сообщений об ошибках
  // TODO: сопоставлять changedKeys и список полей в конкретной форме. Чтобы валидировать ошибки только по задействованным полям.
  const orderErrors = getErrorsText(buyer.validate(['payment', 'address']));
  const contactsErrors = getErrorsText(buyer.validate(['phone', 'email']));

  const { payment, address, phone, email } = buyer.getData();

  formOrder.render({payment, address, errors: orderErrors, actionButtonEnabled: !orderErrors.length});
  formContacts.render({phone, email, errors: contactsErrors, actionButtonEnabled: !contactsErrors.length});
});


// Получить тексты ошибок из объекта валидации
function getErrorsText(errors: BuyerValidationErrors) {
  return Object.values(errors).filter(Boolean);
}



// Обработчик события изменения состава каталога
// Обновить представление каталога в соответствии с актуальными данными
eventBroker.on('catalog:data-changed', () => {
  const productCards = catalog.getProductList().map(product => {
    const productCardCatalogContent = cloneTemplate(productCardCatalogTemplate);

    // Карточка каталога, и обработчик(и) событий карточки
    const productCard = new ProductCardCatalog(productCardCatalogContent, {
      click: () => {
        eventBroker.emit('catalog:item-click', product);
      }
    });
    
    const { title, price, category, image } = product;
    return productCard.render({ title, price, category, image: `${CDN_URL}${image}` });
  });

  catalogGalleryView.render({items: productCards});
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
      card.render({
        actionButtonText: 'Недоступно',
        actionButtonEnabled: false
      });
      return;
    }

    card.render({
      actionButtonText: cart.has(product.id) ? 
        'Удалить из корзины' : 
        'Купить',
      actionButtonEnabled: true
    });
  };


  const product = catalog.getSelectedProduct();

  if(!product) return;

  const { title, description, image, category, price } = product;
  productCardFullView.render({ title, description, image: `${CDN_URL}${image}`, category, price });
  
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
    const order: IOrder = Object.assign({
      ...buyer.getData(),
      total: cart.getSubtotal(),
      items: cart.getItems().map(item => item.id)
    }, 
    buyer.getData());

    (async () => {
      try {
        const orderResponse: IOrderResponse = await apiService.createOrder(order);
        
        cart.removeAll();
        buyer.clearAll();

        modalView.render({content: orderResultSuccess.render({ total: orderResponse.total })});

      } catch(error) {
        console.error('Ошибка: ', error);
      }
    })();
});


eventBroker.on('success:ok', () => {
  modalView.close();
});


// Init
(async() => {
  cart.removeAll();
  buyer.clearAll();

  try {
    const productsList: IProductListResponse = await apiService.getProducts();
    catalog.setProductList(productsList.items);
    
  } catch(error) {
    console.error('Ошибка: ', error);
    throw error;
  }
})();
