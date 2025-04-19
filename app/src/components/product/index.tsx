```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { addItem, removeItem } from '@/lib/store/slices/cartSlice';
import { useToast } from '@/lib/hooks/useToast';
import { formatters } from '@/lib/utils/formatters';

interface ProductProps {
  product: any;
}

export function Product({ product }: ProductProps) {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showSuccess } = useToast();

  const addToCart = () => {
    dispatch(addItem({ ...product, quantity }));
    showSuccess('Item successfully added to your cart.', {
      action: {
        label: 'Go to Cart',
        onClick: () => navigate('/checkout')
      }
    });
  };

  const removeFromCart = () => {
    setQuantity(1);
    dispatch(removeItem(product.sku));
    showSuccess('Item successfully removed from your cart.', {
      action: {
        label: 'Go to Cart',
        onClick: () => navigate('/checkout')
      }
    });
  };

  const onQuantityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
    if (isInCart()) {
      dispatch(addItem({ ...product, quantity: newQuantity }));
    }
  };

  const isInCart = () => {
    return false; // TODO: Implement cart check logic
  };

  return (
    <div 
      className={`
        flex flex-col items-start h-[530px]
        ${product.category === 'Hemming' ? 'hemming-card h-[300px]' : ''}
      `}
    >
      <img
        src={product.url}
        alt={product.name}
        loading="lazy"
        className={
          product.category === 'Hemming'
            ? 'w-full h-auto'
            : 'w-auto max-w-[300px] h-auto aspect-[5/6] object-cover'
        }
      />
      
      <p className="font-bold mt-1.5 mb-1.5">{product.name}</p>
      
      <div className="w-full flex justify-between items-center gap-2.5">
        <div className="flex items-center">
          <p className="font-bold m-0 mr-1.5">Qty:</p>
          <select
            value={quantity}
            onChange={onQuantityChange}
            className="w-20 p-2 border border-gray-300 rounded outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <p>{formatters.formatCurrency(product.cost)}</p>
      </div>

      {product.ext?.nonReturnable && (
        <small className="text-red-500 mt-2.5 mb-2.5">Non Returnable</small>
      )}

      {!isInCart() ? (
        <button
          className="w-full h-10 mb-2.5 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={addToCart}
        >
          Add to Bag
        </button>
      ) : (
        <button
          className="w-full h-10 mb-2.5 border-2 border-primary text-primary rounded hover:bg-primary-hover"
          onClick={removeFromCart}
        >
          Remove from Bag
        </button>
      )}
    </div>
  );
}
```