import { getCart } from 'lib/vendure';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const cart = await getCart();
  console.log(cart?.id);
  return <CartModal cart={cart} />;
}
