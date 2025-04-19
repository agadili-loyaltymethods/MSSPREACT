```tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProductService } from '@/lib/hooks/useProductService';
import { useToast } from '@/lib/hooks/useToast';
import { ProductHelper } from '@/lib/utils/product-helper';
import { Product } from '../product';
import { NoData } from '../common/no-data';

export function Purchase() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { getProducts } = useProductService();
  const { showError } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Handle fragment changes
    const fragment = location.hash.slice(1);
    if (fragment) {
      selectCategory(fragment);
    }
  }, [location.hash]);

  const fetchProducts = async () => {
    try {
      const products = await getProducts();
      setAllProducts(products);
      const categories = ProductHelper.getCategories(products);
      setAllCategories(categories);

      // Navigate to first category if exists
      if (categories.length > 0) {
        navigate(`#${categories[0]}`);
      }
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    navigate(`#${category}`);
    setFilteredProducts(allProducts.filter(x => x.category === category));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-wrap gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="flex-[0_0_20%]">
              <div className="animate-pulse">
                <div className="h-[150px] bg-gray-200 rounded mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-[1300px] mt-5">
        <div className="flex justify-center mb-5">
          <div className="filter-container bg-gray-200 rounded-[50px] h-[30px] flex items-center p-0.5 overflow-hidden">
            <div className="flex gap-2">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`
                    px-4 py-1 rounded-full text-sm
                    ${selectedCategory === category 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-300'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-[1300px]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={index} className="flex-[0_0_23%]">
                <Product product={product} />
              </div>
            ))
          ) : (
            <NoData>No products available.</NoData>
          )}
        </div>
      </div>
    </div>
  );
}
```