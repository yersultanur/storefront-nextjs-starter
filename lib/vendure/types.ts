export type Maybe<T> = T | null;

export type Items<T> = {
  items: Array<T>;
};

export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
  /** The `Money` scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Money: { input: string; output: string };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = VendureImage & {
  altText: string;
  url: string;
};

export type ImageSearch = SearchResultAsset & {
  altText: string;
};

export type VendureImage = {
  createdAt?: Scalars['DateTime']['output'];
  height?: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  preview: Scalars['String']['output'];
  updatedAt?: Scalars['DateTime']['output'];
  width?: Scalars['Int']['output'];
};

export type Collection = VendureCollection & {
  seo?: {
    title?: string;
    description?: string;
  };
  path: string;
  title?: string;
  handle?: string;
};

export type VendureCollection = {
  children?: Maybe<Array<VendureCollection>>;
  description: Scalars['String']['output'];
  featuredAsset?: Maybe<VendureImage>;
  name?: Scalars['String']['output'];
  parent?: Maybe<VendureCollection>;
  slug?: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

type Tag = {
  id: string;
  createdAt: string;
  updatedAt: string;
  value: string;
};

export type Product = Partial<
  Omit<VendureProduct, 'variants' | 'assets' | 'images' | 'options' | 'tags'>
> & {
  title: string;
  variants: ProductVariant[];
  images: Image[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  featuredImage: FeaturedImage;
  handle?: string | null;
  descriptionHtml: string;
  availableForSale: boolean;
  options: Array<ProductOption>;
  seo: {
    title?: string;
    description?: string;
  };
  tags: Array<string>;
};

export type VendureProduct = {
  assets: Array<VendureImage>;
  collections: Array<VendureCollection>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<VendureImage>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Returns a paginated, sortable, filterable list of ProductVariants */
  variants: Array<VendureProductVariant>;
  optionGroups: Array<VendureProductOptionGroup>;
};

export type VendureProductVariant = {
  assets: Array<VendureImage>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']['output']>;
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<VendureImage>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  options: Array<VendureProductOption>;
  price: Scalars['Money']['output'];
  priceWithTax: Scalars['Money']['output'];
  product: VendureProduct;
  productId: Scalars['ID']['output'];
  sku: Scalars['String']['output'];
  stockLevel: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductCollection = Partial<Omit<SearchProductVendure, 'productAsset' | 'images'>> & {
  title: string;
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  featuredImage: FeaturedImage;
  handle?: string | null;
};

export type FeaturedImage = SearchResultAsset & {
  url: string;
  width?: number;
  height?: number;
  altText: string;
};

export type SearchResultPrice = PriceRange;

export type SearchResultAsset = {
  id?: Scalars['ID']['output'];
  preview?: Scalars['String']['output'];
};

export type SearchProductVendure = {
  collectionIds: Array<Scalars['ID']['output']>;
  currencyCode: CurrencyCode;
  description: Scalars['String']['output'];
  facetIds: Array<Scalars['ID']['output']>;
  facetValueIds: Array<Scalars['ID']['output']>;
  inStock: Scalars['Boolean']['output'];
  price: SearchResultPrice;
  priceWithTax: SearchResultPrice;
  productAsset: Maybe<SearchResultAsset>;
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  productVariantAsset?: Maybe<SearchResultAsset>;
  productVariantId: Scalars['ID']['output'];
  productVariantName: Scalars['String']['output'];
  /** A relevance score for the result. Differs between database implementations */
  score: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  slug?: Scalars['String']['output'];
};

export type VendureProductOperation = {
  data: { product: VendureProduct };
  variables: {
    handle: string;
  };
};

export type VendureProductsOperation = {
  data: {
    products: VendureProduct[];
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type VendureProductRecommendationsOperation = {
  data: {
    product: VendureProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ProductOption = Omit<VendureProductOption, 'values' | 'name'> & {
  availableForSale: boolean;
  name: string;
  values: string[];
};

export type VendureProductOption = {
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  group?: VendureProductOptionGroup;
  groupId?: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VendureProductOptionGroup = {
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  options: Array<VendureProductOption>;
  updatedAt: Scalars['DateTime']['output'];
};

type Breadcrumb = {
  id: string;
  name: string;
  slug: string;
};

export type VendureCollectionsOperation = {
  data: {
    collections: Items<VendureCollection>;
  };
};

export type VendureCollectionOperation = {
  data: {
    collection: VendureCollection;
  };
  variables: {
    handle: string;
  };
};

export type VendureAddToCartOperation = {
  data: {
    addItemToOrder: {
      cart: VendureCart;
    };
  };
  variables: {
    cartId: string;
    quantity: number;
  };
};

export type VendureCreateCartOperation = {
  data: { addItemToOrder: { cart: VendureCart } };
};

export type VendureRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: VendureCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type VendureUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: VendureCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type VendureCollectionProductsOperation = {
  data: {
    collection: VendureCollection[];
    search: Items<SearchProductVendure>;
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type VendureCartOperation = {
  data: {
    cart: VendureCart;
  };
  variables: {
    cartId: string;
  };
};

export type SEO = {
  title?: string;
  description?: string;
};

type Facet = {
  id: string;
  code: string;
  name: string;
};

type FacetValue = {
  facet: Facet;
  id: string;
  code: string;
  name: string;
};

type FeaturedAsset = {
  id: string;
  preview: string;
  url: string;
  width: number;
  height: number;
  altText: string;
};

export type Variant = {
  id: string;
  name: string;
  priceWithTax: number;
  currencyCode: CurrencyCode;
  sku: string;
  stockLevel: string;
  featuredAsset?: any;
};

// VendureCart

type TaxSummary = {
  description: string;
  taxRate: number;
  taxTotal: number;
};

export type ShippingAddress = {
  id?: string;
  fullName?: string;
  streetLine1?: string;
  streetLine2?: string;
  company?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  countryCode?: string;
  phoneNumber?: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
  country?: string;
};

export type ProductVariant = Omit<VendureProductVariant, 'price' | 'name'> & {
  name: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type Line = {
  id: string;
  unitPriceWithTax: number;
  linePriceWithTax: number;
  quantity: number;
  featuredAsset: FeaturedAsset;
  productVariant: ProductVariant;
};

export type VendureCart = {
  /** An order is active as long as the payment process has not been completed */
  active: Scalars['Boolean']['output'];
  // billingAddress?: Maybe<OrderAddress>;
  /** A unique code for the Order */
  code: Scalars['String']['output'];
  /** An array of all coupon codes applied to the Order */
  couponCodes: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']['output']>;
  // customer?: Maybe<Customer>;
  // discounts: Array<Discount>;
  // fulfillments?: Maybe<Array<Fulfillment>>;
  // history: HistoryEntryList;
  id: Scalars['ID']['output'];
  lines: Array<VendureLineItem>;
  /**
   * The date & time that the Order was placed, i.e. the Customer
   * completed the checkout and the Order is no longer "active"
   */
  orderPlacedAt?: Maybe<Scalars['DateTime']['output']>;
  // payments?: Maybe<Array<Payment>>;
  /** Promotions applied to the order. Only gets populated after the payment process has completed. */
  // promotions: Array<Promotion>;
  shipping: Scalars['Money']['output'];
  // shippingAddress?: Maybe<OrderAddress>;
  shippingLines: Array<ShippingLine>;
  shippingWithTax: Scalars['Money']['output'];
  state: Scalars['String']['output'];
  /**
   * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
   * discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
   * To get a total of all OrderLines which does not account for prorated discounts, use the
   * sum of `OrderLine.discountedLinePrice` values.
   */
  subTotal: Scalars['Money']['output'];
  /** Same as subTotal, but inclusive of tax */
  subTotalWithTax: Scalars['Money']['output'];
  /**
   * Surcharges are arbitrary modifications to the Order total which are neither
   * ProductVariants nor discounts resulting from applied Promotions. For example,
   * one-off discounts based on customer interaction, or surcharges based on payment
   * methods.
   */
  // surcharges: Array<Surcharge>;
  /** A summary of the taxes being applied to this Order */
  // taxSummary: Array<OrderTaxSummary>;
  /** Equal to subTotal plus shipping */
  total: Scalars['Money']['output'];
  totalQuantity: Scalars['Int']['output'];
  /** The final payable amount. Equal to subTotalWithTax plus shippingWithTax */
  totalWithTax: Scalars['Money']['output'];
  // type: OrderType;
  updatedAt: Scalars['DateTime']['output'];
};

export type VendureLineItem = {
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  /** The price of the line including discounts, excluding tax */
  discountedLinePrice: Scalars['Money']['output'];
  /** The price of the line including discounts and tax */
  discountedLinePriceWithTax: Scalars['Money']['output'];
  /**
   * The price of a single unit including discounts, excluding tax.
   *
   * If Order-level discounts have been applied, this will not be the
   * actual taxable unit price (see `proratedUnitPrice`), but is generally the
   * correct price to display to customers to avoid confusion
   * about the internal handling of distributed Order-level discounts.
   */
  discountedUnitPrice: Scalars['Money']['output'];
  /** The price of a single unit including discounts and tax */
  discountedUnitPriceWithTax: Scalars['Money']['output'];
  // discounts: Array<Discount>;
  featuredAsset?: Maybe<VendureImage>;
  // fulfillmentLines?: Maybe<Array<FulfillmentLine>>;
  id: Scalars['ID']['output'];
  /** The total price of the line excluding tax and discounts. */
  linePrice: Scalars['Money']['output'];
  /** The total price of the line including tax but excluding discounts. */
  linePriceWithTax: Scalars['Money']['output'];
  /** The total tax on this line */
  lineTax: Scalars['Money']['output'];
  order: VendureCart;
  /** The quantity at the time the Order was placed */
  orderPlacedQuantity: Scalars['Int']['output'];
  productVariant: VendureProductVariant;
  /**
   * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
   * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
   * and refund calculations.
   */
  proratedLinePrice: Scalars['Money']['output'];
  /** The proratedLinePrice including tax */
  proratedLinePriceWithTax: Scalars['Money']['output'];
  /**
   * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
   * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
   * and refund calculations.
   */
  proratedUnitPrice: Scalars['Money']['output'];
  /** The proratedUnitPrice including tax */
  proratedUnitPriceWithTax: Scalars['Money']['output'];
  /** The quantity of items purchased */
  quantity: Scalars['Int']['output'];
  // taxLines: Array<TaxLine>;
  taxRate: Scalars['Float']['output'];
  /** The price of a single unit, excluding tax and discounts */
  unitPrice: Scalars['Money']['output'];
  /** Non-zero if the unitPrice has changed since it was initially added to Order */
  unitPriceChangeSinceAdded: Scalars['Money']['output'];
  /** The price of a single unit, including tax but excluding discounts */
  unitPriceWithTax: Scalars['Money']['output'];
  /** Non-zero if the unitPriceWithTax has changed since it was initially added to Order */
  unitPriceWithTaxChangeSinceAdded: Scalars['Money']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Cart = Partial<VendureCart> & {
  lines: CartItem[];
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
};

export type CartItem = VendureLineItem & {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type OrderPriceFields = keyof Pick<
  VendureCart,
  'subTotal' | 'totalWithTax' | 'subTotalWithTax' | 'shippingWithTax'
>;

type ShippingLine = {
  priceWithTax: 1000;
  shippingMethod: { id: string; name: string };
};

// search

type ProductAsset = {
  id: string;
  preview: string;
};

type PriceWithTax = {
  value: number;
};

type Item = {
  productId: string;
  productName: string;
  slug: string;
  productAsset: ProductAsset[];
  currencyCode: CurrencyCode;
  price: Price;
};

export type Price = PriceRange | SinglePrice;

export type PriceRange = {
  max: Scalars['Money']['output'];
  min: Scalars['Money']['output'];
};

export type SinglePrice = {
  value: Scalars['Money']['output'];
};

type FilterFacetValueDetail = {
  id: string;
  name: string;
  facet: Facet;
};

type FilterFacetValue = {
  count: number;
  facetValue: FilterFacetValueDetail;
};

export type FacetWithValues = {
  id: string;
  name: string;
  open: boolean;
  values: Array<{
    id: string;
    name: string;
    selected: boolean;
  }>;
};

export type Review = {
  id: number;
  title: string;
  rating: number;
  content: string;
  author: string;
  date: string;
  datetime: string;
};

export type ActiveCustomer = {
  title?: string;
  firstName: string;
  id: string;
  lastName: string;
  emailAddress?: string;
  phoneNumber?: string;
};

export type Login = ActiveCustomer & {
  __typename: 'CurrentUser' | string;
  message: string;
};

export type RegisterCustomer = Omit<ActiveCustomer, 'id'> & {
  password: string;
  success?: boolean;
  message?: string;
};

export type EligibleShippingMethods = {
  id: string;
  name: string;
  price: number;
  priceWithTax: number;
};

export type EligiblePaymentMethods = {
  name: string;
  code: string;
  isEligible: boolean;
};

export type Country = {
  id: string;
  code: string;
  name: string;
};

export type ActiveCustomerOrders = {
  id: string;
  orders: {
    items: ActiveCustomerOrder[];
    totalItems: string;
  };
};

export type ActiveCustomerOrder = {
  id: string;
  code: string;
  state: string;
  totalWithTax: number;
  currencyCode: string;
  lines: {
    featuredAsset: {
      preview: string;
    };
    productVariant: { name: string };
  }[];
};

export type CurrencyCode =
  /** United Arab Emirates dirham */
  | 'AED'
  /** Afghan afghani */
  | 'AFN'
  /** Albanian lek */
  | 'ALL'
  /** Armenian dram */
  | 'AMD'
  /** Netherlands Antillean guilder */
  | 'ANG'
  /** Angolan kwanza */
  | 'AOA'
  /** Argentine peso */
  | 'ARS'
  /** Australian dollar */
  | 'AUD'
  /** Aruban florin */
  | 'AWG'
  /** Azerbaijani manat */
  | 'AZN'
  /** Bosnia and Herzegovina convertible mark */
  | 'BAM'
  /** Barbados dollar */
  | 'BBD'
  /** Bangladeshi taka */
  | 'BDT'
  /** Bulgarian lev */
  | 'BGN'
  /** Bahraini dinar */
  | 'BHD'
  /** Burundian franc */
  | 'BIF'
  /** Bermudian dollar */
  | 'BMD'
  /** Brunei dollar */
  | 'BND'
  /** Boliviano */
  | 'BOB'
  /** Brazilian real */
  | 'BRL'
  /** Bahamian dollar */
  | 'BSD'
  /** Bhutanese ngultrum */
  | 'BTN'
  /** Botswana pula */
  | 'BWP'
  /** Belarusian ruble */
  | 'BYN'
  /** Belize dollar */
  | 'BZD'
  /** Canadian dollar */
  | 'CAD'
  /** Congolese franc */
  | 'CDF'
  /** Swiss franc */
  | 'CHF'
  /** Chilean peso */
  | 'CLP'
  /** Renminbi (Chinese) yuan */
  | 'CNY'
  /** Colombian peso */
  | 'COP'
  /** Costa Rican colon */
  | 'CRC'
  /** Cuban convertible peso */
  | 'CUC'
  /** Cuban peso */
  | 'CUP'
  /** Cape Verde escudo */
  | 'CVE'
  /** Czech koruna */
  | 'CZK'
  /** Djiboutian franc */
  | 'DJF'
  /** Danish krone */
  | 'DKK'
  /** Dominican peso */
  | 'DOP'
  /** Algerian dinar */
  | 'DZD'
  /** Egyptian pound */
  | 'EGP'
  /** Eritrean nakfa */
  | 'ERN'
  /** Ethiopian birr */
  | 'ETB'
  /** Euro */
  | 'EUR'
  /** Fiji dollar */
  | 'FJD'
  /** Falkland Islands pound */
  | 'FKP'
  /** Pound sterling */
  | 'GBP'
  /** Georgian lari */
  | 'GEL'
  /** Ghanaian cedi */
  | 'GHS'
  /** Gibraltar pound */
  | 'GIP'
  /** Gambian dalasi */
  | 'GMD'
  /** Guinean franc */
  | 'GNF'
  /** Guatemalan quetzal */
  | 'GTQ'
  /** Guyanese dollar */
  | 'GYD'
  /** Hong Kong dollar */
  | 'HKD'
  /** Honduran lempira */
  | 'HNL'
  /** Croatian kuna */
  | 'HRK'
  /** Haitian gourde */
  | 'HTG'
  /** Hungarian forint */
  | 'HUF'
  /** Indonesian rupiah */
  | 'IDR'
  /** Israeli new shekel */
  | 'ILS'
  /** Indian rupee */
  | 'INR'
  /** Iraqi dinar */
  | 'IQD'
  /** Iranian rial */
  | 'IRR'
  /** Icelandic króna */
  | 'ISK'
  /** Jamaican dollar */
  | 'JMD'
  /** Jordanian dinar */
  | 'JOD'
  /** Japanese yen */
  | 'JPY'
  /** Kenyan shilling */
  | 'KES'
  /** Kyrgyzstani som */
  | 'KGS'
  /** Cambodian riel */
  | 'KHR'
  /** Comoro franc */
  | 'KMF'
  /** North Korean won */
  | 'KPW'
  /** South Korean won */
  | 'KRW'
  /** Kuwaiti dinar */
  | 'KWD'
  /** Cayman Islands dollar */
  | 'KYD'
  /** Kazakhstani tenge */
  | 'KZT'
  /** Lao kip */
  | 'LAK'
  /** Lebanese pound */
  | 'LBP'
  /** Sri Lankan rupee */
  | 'LKR'
  /** Liberian dollar */
  | 'LRD'
  /** Lesotho loti */
  | 'LSL'
  /** Libyan dinar */
  | 'LYD'
  /** Moroccan dirham */
  | 'MAD'
  /** Moldovan leu */
  | 'MDL'
  /** Malagasy ariary */
  | 'MGA'
  /** Macedonian denar */
  | 'MKD'
  /** Myanmar kyat */
  | 'MMK'
  /** Mongolian tögrög */
  | 'MNT'
  /** Macanese pataca */
  | 'MOP'
  /** Mauritanian ouguiya */
  | 'MRU'
  /** Mauritian rupee */
  | 'MUR'
  /** Maldivian rufiyaa */
  | 'MVR'
  /** Malawian kwacha */
  | 'MWK'
  /** Mexican peso */
  | 'MXN'
  /** Malaysian ringgit */
  | 'MYR'
  /** Mozambican metical */
  | 'MZN'
  /** Namibian dollar */
  | 'NAD'
  /** Nigerian naira */
  | 'NGN'
  /** Nicaraguan córdoba */
  | 'NIO'
  /** Norwegian krone */
  | 'NOK'
  /** Nepalese rupee */
  | 'NPR'
  /** New Zealand dollar */
  | 'NZD'
  /** Omani rial */
  | 'OMR'
  /** Panamanian balboa */
  | 'PAB'
  /** Peruvian sol */
  | 'PEN'
  /** Papua New Guinean kina */
  | 'PGK'
  /** Philippine peso */
  | 'PHP'
  /** Pakistani rupee */
  | 'PKR'
  /** Polish złoty */
  | 'PLN'
  /** Paraguayan guaraní */
  | 'PYG'
  /** Qatari riyal */
  | 'QAR'
  /** Romanian leu */
  | 'RON'
  /** Serbian dinar */
  | 'RSD'
  /** Russian ruble */
  | 'RUB'
  /** Rwandan franc */
  | 'RWF'
  /** Saudi riyal */
  | 'SAR'
  /** Solomon Islands dollar */
  | 'SBD'
  /** Seychelles rupee */
  | 'SCR'
  /** Sudanese pound */
  | 'SDG'
  /** Swedish krona/kronor */
  | 'SEK'
  /** Singapore dollar */
  | 'SGD'
  /** Saint Helena pound */
  | 'SHP'
  /** Sierra Leonean leone */
  | 'SLL'
  /** Somali shilling */
  | 'SOS'
  /** Surinamese dollar */
  | 'SRD'
  /** South Sudanese pound */
  | 'SSP'
  /** São Tomé and Príncipe dobra */
  | 'STN'
  /** Salvadoran colón */
  | 'SVC'
  /** Syrian pound */
  | 'SYP'
  /** Swazi lilangeni */
  | 'SZL'
  /** Thai baht */
  | 'THB'
  /** Tajikistani somoni */
  | 'TJS'
  /** Turkmenistan manat */
  | 'TMT'
  /** Tunisian dinar */
  | 'TND'
  /** Tongan paʻanga */
  | 'TOP'
  /** Turkish lira */
  | 'TRY'
  /** Trinidad and Tobago dollar */
  | 'TTD'
  /** New Taiwan dollar */
  | 'TWD'
  /** Tanzanian shilling */
  | 'TZS'
  /** Ukrainian hryvnia */
  | 'UAH'
  /** Ugandan shilling */
  | 'UGX'
  /** United States dollar */
  | 'USD'
  /** Uruguayan peso */
  | 'UYU'
  /** Uzbekistan som */
  | 'UZS'
  /** Venezuelan bolívar soberano */
  | 'VES'
  /** Vietnamese đồng */
  | 'VND'
  /** Vanuatu vatu */
  | 'VUV'
  /** Samoan tala */
  | 'WST'
  /** CFA franc BEAC */
  | 'XAF'
  /** East Caribbean dollar */
  | 'XCD'
  /** CFA franc BCEAO */
  | 'XOF'
  /** CFP franc (franc Pacifique) */
  | 'XPF'
  /** Yemeni rial */
  | 'YER'
  /** South African rand */
  | 'ZAR'
  /** Zambian kwacha */
  | 'ZMW'
  /** Zimbabwean dollar */
  | 'ZWL';
