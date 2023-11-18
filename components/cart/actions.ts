'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/vendure';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(prevState: any, selectedVariantId: string | undefined) {
  let cart = await getCart();

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    await addToCart({ merchandiseId: selectedVariantId, quantity: 1 });
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  let cart = await getCart();

  try {
    await removeFromCart([lineId]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
) {
  let cart = await getCart();

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart([lineId]);
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart({
      id: lineId,
      merchandiseId: variantId,
      quantity
    });
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
