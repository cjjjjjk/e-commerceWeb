const CART_KEY = process.env.REACT_APP_CART_KEY || "guess_cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string,
  color: string,
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
  
  const existingItem = cart.find((p) =>
    p.id === item.id && p.size === item.size && p.color === item.color
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

export function removeFromCart(item: CartItem) {
  const updatedCart = getCart().filter((p) =>
      !(p.id === item.id && p.size === item.size && p.color === item.color)
  );
  saveCart(updatedCart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

