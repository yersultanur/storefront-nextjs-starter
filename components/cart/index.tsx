import { getCart } from 'lib/vendure';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const cart = await getCart();

  return <CartModal cart={cart} />;
}
