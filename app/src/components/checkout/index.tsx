
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { clearCart, addItem, removeItem } from '@/lib/store/slices/cartSlice';
import { useActivityService } from '@/lib/hooks/useActivityService';
import { useToast } from '@/lib/hooks/useToast';
import { formatters } from '@/lib/utils/formatters';
import { NoData } from '../common/no-data';
import { PaymentCards } from '@/types/enums';
import { CheckoutHelper } from '@/lib/utils/checkout-helper';

const HEMMING = 'Hemming';
const DISCOUNT_CATEGORY = 'Discount';
const SHIPPING_CATEGORY = 'Shipping';

export function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getActivity } = useActivityService();
  const { showError } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [paymentType, setPaymentType] = useState(PaymentCards.CREDIT_CARD);
  const [shippingType, setShippingType] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [maxAllowedValue, setMaxAllowedValue] = useState(0);
  const [isHemmingAvailable, setIsHemmingAvailable] = useState(false);
  const [bestOffers, setBestOffers] = useState<any[]>([]);
  const [discountLineItems, setDiscountLineItems] = useState<any[]>([]);
  const [shippingProducts, setShippingProducts] = useState<any[]>([]);
  const [shippingList, setShippingList] = useState<string[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [earnSummary, setEarnSummary] = useState<any>({});
  const [repricedTicket, setRepricedTicket] = useState<any>(null);

  const cartItems = useAppSelector(state => state.cart.items);
  const location = useAppSelector(state => state.location.location);
  const memberInfo = useAppSelector(state => state.member);

  useEffect(() => {
    if (!cartItems.length) {
      setIsLoading(false);
      return;
    }

    setIsHemmingAvailable(cartItems.some(item => item.category === HEMMING));
    updateTotalPrice();
    getRepriceForLineItems(false);
  }, [cartItems]);

  const updateTotalPrice = () => {
    const newSubTotal = CheckoutHelper.calculateSubtotal(cartItems, []);
    setSubTotal(newSubTotal);
    calculateAmount();
  };

  const getShippingAmount = () => {
    return shippingProducts.find(shipping => shippingType === shipping.name)?.cost || 0;
  };

  const calculateAmount = () => {
    const calculateDiscount = () => {
      if (!bestOffers?.length) return 0;
      return bestOffers.reduce((total, offer) => 
        total + (offer?.discount ?? CheckoutHelper.calculateTicketDiscount(discountLineItems)), 0);
    };

    let discountedAmount = subTotal - calculateDiscount();

    if (isHemmingAvailable) {
      discountedAmount -= sliderValue;
    }

    if (shippingType) {
      discountedAmount += getShippingAmount();
    }

    const tax = discountedAmount * (0.2); // 20% tax rate
    setTaxAmount(parseFloat(tax.toFixed(2)));
    setTotalAmount(parseFloat((discountedAmount + tax).toFixed(2)));
  };

  const getRepriceForLineItems = async (persist: boolean) => {
    if (!cartItems?.length) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getActivity(
        CheckoutHelper.createRepricePayload(
          totalAmount,
          prepareLineItems(true),
          CheckoutHelper.createTenderItems(paymentType, totalAmount),
          location,
          null
        )
      );

      setBestOffers(response.data.bestOffers ?? []);
      setDiscountLineItems(response.data.repricedTicket?.lineItems.filter(
        (lineItem: any) => lineItem.type === DISCOUNT_CATEGORY
      ) ?? []);
      setMaxAllowedValue(Math.min(
        response.data?.availableHemmingCredit,
        response.data?.maxHemmingDiscount
      ) ?? 0);
      setRepricedTicket(response.data.repricedTicket);
      calculateAmount();
      getAccrualPoints(persist);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
      calculateAmount();
    }
  };

  const getAccrualPoints = async (persist: boolean) => {
    setIsLoading(true);
    try {
      const response = await getActivity(
        CheckoutHelper.createAccrualPayload(
          totalAmount,
          persist ? prepareLineItems() : (repricedTicket?.lineItems ?? prepareLineItems()),
          CheckoutHelper.createTenderItems(paymentType, totalAmount),
          location,
          bestOffers,
          null
        )
      );
      setEarnSummary(response.data?.earnSummary ?? {});
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const prepareLineItems = (isReprice = false) => {
    return CheckoutHelper.createLineItems(
      cartItems,
      discountLineItems,
      taxAmount,
      isReprice ? 0 : sliderValue,
      shippingProducts.find(shipping => shipping.name === shippingType)
    );
  };

  const purchaseItems = async () => {
    try {
      await getActivity(
        CheckoutHelper.createAccrualPayload(
          totalAmount,
          prepareLineItems(),
          CheckoutHelper.createTenderItems(paymentType, totalAmount),
          location,
          bestOffers,
          null
        )
      );
      navigate('/purchase-confirmation');
      dispatch(clearCart());
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    }
  };

  const onQuantityChange = (quantity: number, item: any) => {
    dispatch(addItem({ ...item, quantity }));
  };

  const removeFromCart = (item: any) => {
    dispatch(removeItem(item.sku));
  };

  if (!cartItems.length) {
    return <NoData>No products are available in the cart.</NoData>;
  }

  // Render JSX for checkout form
  // This would include all the form fields, product list, summary, etc.
  // Breaking this into smaller components would be ideal for maintainability
  
  return (
    // Component JSX implementation
    <div className="flex justify-center items-center gap-5 w-full">
      {/* Add the full JSX implementation here */}
    </div>
  );
}
