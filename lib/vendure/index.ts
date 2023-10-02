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
  Menu,
  SearchProductVendure,
  SearchProductAsset,
  ImageSearch
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
import { getProductQuery, getProductsQuery } from './providers/products/products';
import Search from 'components/layout/navbar/search';


const endpoint = process.env.NEXT_PUBLIC_VENDURE_BACKEND_API ?? `http://localhost:3000/shop-api`;
const key = process.env.VENDURE_API_KEY ?? ``;

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
  variables?: Record<string, any>
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'vendure-token': key,
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

const reshapeCart = (cart: VendureCart): Cart => {
  const checkoutUrl = `/checkout`;

  const cost = {
    subtotalAmount: cart.subTotal,
    totalAmount: cart.total,
    totalTaxAmount: cart.totalWithTax,
  };

  return {
    ...cart,
    lines: cart.lines,
    checkoutUrl,
    id: cart.id,
    cost,
  };
};

const reshapeCollection = (collection: VendureCollection): Collection => {

  const handle = collection.slug
  const title = collection.name

  return {
    ...collection,
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

const reshapeImages = (images?: VendureImage[], productTitle?: string): Image[] => {
  if (!images) return [];


  return images.map((image) => {
    const url = image.preview
    const filename = image.preview.match(/.*\/(.*)\..*/)![1];
    return {
      ...image,
      url,
      altText: `${productTitle} - ${filename}`
    };
  });
};

const reshapeProductImages = (images?: SearchProductAsset[], productTitle?: string): ImageSearch[] => {
  if (!images) return [];


  return images.map((image) => {
    const url = image.preview
    const filename = image.preview.match(/.*\/(.*)\..*/)![1];
    return {
      ...image,
      url,
      altText: `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (product: VendureProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts)) {
    return undefined;
  }

  const { variants, ...rest } = product;
  const title = product.name
  const handle = product.slug
  const images = reshapeImages(product.assets, title);


  return {
    ...rest,
    images,
    variants: variants,
    handle,
    title
  };
};

const reshapeCollectionProducts = (product: SearchProductVendure) => {

  const title = product.items.productName
  const handle = product.items.slug
  const images = reshapeProductImages(product.items.productAsset, title);


  return {
    images,
    handle,
    title
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

export async function createCart(): Promise<Cart> {
  const res = await vendureFetch<VendureCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { variantId: string; quantity: number }[]
): Promise<Cart> {
  const res = await vendureFetch<VendureAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await vendureFetch<VendureRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await vendureFetch<VendureUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await vendureFetch<VendureCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
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
  const vendureCollections = (res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      name: 'All',
      slug: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(vendureCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
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
}): Promise<Product[]> {
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
  const product = res.body.data.search

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

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await vendureFetch<VendureProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
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
  const topic = headers().get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
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
