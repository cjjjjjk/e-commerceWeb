const CART_KEY = process.env.REACT_APP_CART_KEY || "guess_cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function getCart(): CartItem[] {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existingItem = cart.find((p) => p.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(productId: string) {
  const updatedCart = getCart().filter((item) => item.id !== productId);
  saveCart(updatedCart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
