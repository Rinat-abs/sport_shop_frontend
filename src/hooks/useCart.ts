import {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
  } from '../store/api/api';
  import type { AddToCartRequest } from '../types';
  
  export const useCart = () => {
    const { data: cartItems = [], isLoading, error } = useGetCartQuery();
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
    const isProductInCart = (productId: number) => {
      return cartItems.some(item => item.product.id === productId);
    };
  
    const getCartItemId = (productId: number) => {
      const item = cartItems.find(item => item.product.id === productId);
      return item?.id;
    };
  
    const getProductQuantityInCart = (productId: number) => {
      const item = cartItems.find(item => item.product.id === productId);
      return item?.quantity || 0;
    };
  
    const addItemToCart = (productId: number, quantity: number = 1) => {
      const cartItem: AddToCartRequest = { productId, quantity };
      return addToCart(cartItem);
    };
  
    return {
      cartItems,
      total,
      itemsCount,
      isLoading,
      error,
      addItemToCart,
      removeFromCart,
      clearCart,
      isAdding,
      isRemoving,
      isClearing,
      isProductInCart,
      getCartItemId,
      getProductQuantityInCart,
    };
  };