import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { removeItem } from '@/lib/store/slices/cartSlice';
import { formatters } from '@/lib/utils/formatters';

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => {
    const cart = state.cart;
    if (cart.items.length === 1 && cart.items[0]?.lineItems) {
      return cart.items[0].lineItems
        .map((item: any) => ({
          ...(item.product),
          quantity: item.quantity
        }))
        .filter((item: any) => !item?.ext?.hideInMSSP);
    }
    return cart.items.filter((item: any) => !item?.type);
  });

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.cost * item.quantity), 0);

  const removeFromCart = (product: any) => {
    dispatch(removeItem(product.sku));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer"
      >
        <span className="cart-count pt-49 relative">
          <img src="/assets/icons/cart-icon.svg" alt="Cart" />
          <em className="absolute top-5 right-1 w-[22px] h-[22px] text-center leading-5 text-red-500 font-bold">
            {totalItems}
          </em>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[350px] bg-white shadow-lg rounded-lg z-50">
          <div className="flex flex-col w-full">
            <div className="product-list w-full flex-auto overflow-y-auto max-h-[350px] p-2.5">
              {cartItems.length > 0 ? (
                cartItems.map((product: any) => (
                  <div key={product.sku} className="flex items-center mb-2.5">
                    <img 
                      className="w-1/5"
                      src={product.url} 
                      alt={product.name} 
                      title={product.desc} 
                      loading="lazy" 
                    />
                    <div className="flex-[60%] flex flex-col gap-1.5 pl-1.5">
                      <strong className="mb-2.5">{product.name}</strong>
                      <strong>
                        {product.quantity} x {formatters.formatCurrency(product.cost)}
                      </strong>
                    </div>
                    <button 
                      className="flex-[20%]"
                      onClick={() => removeFromCart(product)}
                    >
                      <span className="text-red-500 text-2xl">×</span>
                    </button>
                  </div>
                ))
              ) : (
                <div>
                  <p className="text-lg font-semibold">Your cart is empty!</p>
                  <p>Start adding items to your cart to see them here.</p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="checkout-footer w-full p-2.5 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-10">
                <small>Cart Total</small>
                <strong>{formatters.formatCurrency(totalPrice)}</strong>
                <Link
                  to="/checkout"
                  className="block w-full mt-2.5 px-4 py-2 bg-primary text-white text-center rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}