import { HIDDEN_PRODUCT_TAG, TAGS } from 'lib/constants';
import { isVendureError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  Product,
  Collection,
  VendureCollectionsOperation,
  VendureAddToCartOperation,
  VendureCart,
  VendureCreateCartOperation,
  VendureRemoveFromCartOperation,
  VendureUpdateCartOperation,
  VendureCartOperation,
  VendureCollectionProductsOperation,
  VendureCollectionOperation,
  Cart,
  Image,
  VendureProductOperation,
  VendureProductsOperation,
  VendureImage,
  VendureCollection,
  VendureProduct,
  ProductVariant,
  SelectedOption,
  VendureProductOption,
  VendureProductVariant,
  VendureProductOptionGroup,
  VendureProductRecommendationsOperation,
  SearchProductVendure,
  Items,
  ProductCollection,
  ProductOption,
  CartItem,
  VendureLineItem
} from './types';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './providers/collections/collections';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './providers/mutations/cart';
import { getCartQuery } from './providers/orders/order';
import {
  getProductQuery,
  getProductsQuery,
  getProductRecommendationsQuery
} from './providers/products/products';

const endpoint = process.env.NEXT_PUBLIC_VENDURE_BACKEND_API ?? `http://localhost:3000/shop-api`;
const key = process.env.VENDURE_API_KEY ?? `auth_token`;
const AUTH_TOKEN_KEY = 'token';

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function vendureFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: Record<string, any>;
}): Promise<{ status: number; body: T } | never> {
  let authToken = '';

  // Check if running in a browser environment before using localStorage
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem(AUTH_TOKEN_KEY) || '';
  }

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
        ...headers
      },
      credentials: 'include',
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isVendureError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeItems = (array: Items<any>) => {
  return array.items.map((item) => item);
};

const reshapeCart = (cart: VendureCart): Cart => {
  const checkoutUrl = `/checkout`;
  const lines = cart?.lines?.map((item) => reshapeLineItem(item)) || [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  const currencyCode = cart?.currencyCode || 'USD';
  const cost = {
    subtotalAmount: {
      amount: cart?.subTotal || '0',
      currencyCode: currencyCode
    },
    totalAmount: {
      amount: cart?.total || '0',
      currencyCode: currencyCode
    },
    totalTaxAmount: {
      amount: cart?.totalWithTax || '0',
      currencyCode: currencyCode
    }
  };
  const id = cart?.id;

  return {
    ...cart,
    id,
    totalQuantity,
    lines,
    checkoutUrl,
    cost
  };
};

const reshapeLineItem = (lineItem: VendureLineItem): CartItem => {
  const product: Product = {
    title: lineItem.productVariant.name,
    priceRange: {
      maxVariantPrice: {
        amount: lineItem.productVariant.price,
        currencyCode: lineItem.productVariant.currencyCode
      },
      minVariantPrice: {
        amount: lineItem.productVariant.price,
        currencyCode: lineItem.productVariant.currencyCode
      }
    },
    updatedAt: lineItem.updatedAt,
    createdAt: lineItem.createdAt,
    tags: [],
    descriptionHtml: lineItem.productVariant.product.description ?? '',
    featuredImage: {
      url: lineItem.featuredAsset?.preview ?? '',
      altText: lineItem.featuredAsset?.name ?? ''
    },
    availableForSale: true,
    variants: [lineItem.productVariant && reshapeProductVariant(lineItem.productVariant)],
    handle: lineItem.productVariant?.product?.slug ?? '',
    options: [] as ProductOption[],
    images: reshapeImages(lineItem.productVariant.product.assets),
    seo: {
      title: lineItem.productVariant.name,
      description: lineItem.productVariant.product.description
    }
  };

  const selectedOptions =
    lineItem.productVariant?.options?.map((option) => ({
      name: option.name ?? '',
      value: option.code
    })) || [];

  const merchandise = {
    id: lineItem.productVariant.id || lineItem.id,
    selectedOptions,
    product,
    title: lineItem.productVariant.name ?? ''
  };

  const cost = {
    totalAmount: {
      amount: lineItem.productVariant.price,
      currencyCode: lineItem.productVariant.currencyCode || 'USD'
    }
  };
  const quantity = lineItem.quantity;
  const id = lineItem.id;

  return {
    ...lineItem,
    id,
    merchandise,
    cost,
    quantity
  };
};

const reshapeCollection = (collection: VendureCollection): Collection => {
  const handle = collection?.slug;
  const title = collection.name;
  const description = collection.description;
  const seo = {
    title: collection.name || '',
    description: collection.description || ''
  };
  const updatedAt = collection.updatedAt;

  return {
    ...collection,
    description,
    updatedAt,
    seo,
    handle,
    title,
    path: `/search/${handle}`
  };
};

const reshapeCollections = (collections: VendureCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images?: VendureImage[], title?: string): Image[] => {
  if (!images) return [];

  return images.map((image) => {
    const url = image.preview;
    const filename = image.preview.match(/.*\/(.*)\..*/)![1];
    return {
      ...image,
      url,
      altText: `${title} - ${filename}`
    };
  });
};

const reshapeProductOption = (productOption: VendureProductOptionGroup): ProductOption => {
  const availableForSale = true;
  const name = productOption.name;
  let values = productOption.options.map((option) => option.code) || [];
  values = [...new Set(values)];

  return {
    ...productOption,
    availableForSale,
    name,
    values
  };
};
const reshapeProductVariant = (
  productVariant: VendureProductVariant,
  productOptions?: VendureProductOption[]
): ProductVariant => {
  let selectedOptions: SelectedOption[] = [];
  if (productOptions && productVariant.options) {
    selectedOptions = productVariant.options.map((option) => ({
      name: option.name ?? '',
      value: option.code
    }));
  }

  const availableForSale = true;
  const price = {
    amount: productVariant.price,
    currencyCode: productVariant.currencyCode.toUpperCase() ?? ''
  };

  return {
    ...productVariant,
    availableForSale,
    selectedOptions,
    price
  };
};
const reshapeProduct = (product: VendureProduct): Product => {
  const variants = product.variants.map((variant) =>
    reshapeProductVariant(variant, product.optionGroups)
  );
  const maxPrice = product.variants?.[0]?.price ?? '';
  const currencyCode = product.variants?.[0]?.currencyCode?.toUpperCase() ?? '';
  const title = product.name;
  const handle = product.slug;
  const images = reshapeImages(product.assets, title);
  const priceRange = {
    maxVariantPrice: {
      amount: maxPrice,
      currencyCode: currencyCode
    },
    minVariantPrice: {
      amount: maxPrice,
      currencyCode: currencyCode
    }
  };
  const featuredImageFilename =
    product.variants?.[0]?.featuredAsset?.preview?.match(/.*\/(.*)\..*/)![1];
  const featuredImage = {
    url: product.variants?.[0]?.featuredAsset?.preview ?? '',
    altText: `${title} - ${featuredImageFilename}` ?? ''
  };

  const tags = (product.facetValues || []).map((facetValue) => facetValue.name);

  let options = [] as ProductOption[];
  product.optionGroups &&
    (options = product.optionGroups.map((option) => reshapeProductOption(option)));

  const seo = {
    title: product.name,
    description: product.description
  };

  const descriptionHtml = product.description ?? '';
  const availableForSale = true;
  const id = product.id;

  return {
    ...product,
    images,
    variants,
    handle,
    id,
    priceRange,
    featuredImage,
    descriptionHtml,
    title,
    seo,
    availableForSale,
    tags,
    options
  };
};

const reshapeProducts = (products: VendureProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

const reshapeCollectionProduct = (product: SearchProductVendure): ProductCollection => {
  const title = product.productName;
  const handle = product.slug;
  const priceRange = {
    maxVariantPrice: {
      amount: product.price?.min,
      currencyCode: product.currencyCode?.toUpperCase() ?? ''
    },
    minVariantPrice: {
      amount: product.price?.max,
      currencyCode: product.currencyCode?.toUpperCase() ?? ''
    }
  };
  const featuredImageFilename = product.productAsset?.preview?.match(/.*\/(.*)\..*/)![1];
  const featuredImage = {
    url: product.productAsset?.preview ?? '',
    altText: `${title} - ${featuredImageFilename}` ?? ''
  };

  return {
    ...product,
    handle,
    featuredImage,
    priceRange,
    title
  };
};

const reshapeCollectionProducts = (products: SearchProductVendure[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeCollectionProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  return {
    id: '',
    checkoutUrl: '',
    cost: {
      subtotalAmount: {
        amount: '',
        currencyCode: ''
      },
      totalAmount: {
        amount: '',
        currencyCode: ''
      },
      totalTaxAmount: {
        amount: '',
        currencyCode: ''
      }
    },
    lines: [],
    totalQuantity: 0
  };
}

export async function addToCart(lines: { merchandiseId: string; quantity: number }): Promise<Cart> {
  const res = await vendureFetch<VendureAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId: lines.merchandiseId,
      quantity: lines.quantity
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.addItemToOrder);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const res = await vendureFetch<VendureRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.removeOrderLine);
}

export async function updateCart(lines: {
  id: string;
  merchandiseId: string;
  quantity: number;
}): Promise<Cart> {
  const res = await vendureFetch<VendureUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      lineIds: lines.id,
      quantity: lines.quantity
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.adjustOrderLine);
}

export async function getCart(): Promise<Cart | undefined> {
  const res = await vendureFetch<VendureCartOperation>({
    query: getCartQuery,
    tags: [TAGS.cart],
    cache: 'no-store'
  });

  if (!res.body.data.activeOrder) {
    return undefined;
  }

  const cart = res.body.data.activeOrder;
  console.log(res.body.data.activeOrder);
  return reshapeCart(cart);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await vendureFetch<VendureCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollections(): Promise<Collection[]> {
  const res = await vendureFetch<VendureCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const vendureCollections = removeItems(res.body?.data?.collections);
  const collections = [
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(vendureCollections).filter(
      (collection) => !collection?.handle?.startsWith('hidden')
    )
  ];
  return collections;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<ProductCollection[]> {
  const res = await vendureFetch<VendureCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }
  const product = removeItems(res.body?.data?.search);

  return reshapeCollectionProducts(product);
}

export async function getMenu(menu: string): Promise<any[]> {
  if (menu === 'next-js-frontend-header-menu') {
    const collections = await getCollections();
    return collections.map((col) => ({
      title: col.title,
      path: col.path
    }));
  }

  if (menu === 'next-js-frontend-footer-menu') {
    return [
      { title: 'About Vendure', path: 'https://www.vendure.io/' },
      { title: 'Vendure Docs', path: 'https://docs.vendure.io/' },
      { title: 'Vendure Blog', path: 'https://www.vendure.io/blog' }
    ];
  }

  return [];
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await vendureFetch<VendureProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await vendureFetch<VendureProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.product);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await vendureFetch<VendureProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(res.body.data.products);
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Vendure,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-vendure-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.VENDURE_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
