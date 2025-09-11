import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import toast from 'react-hot-toast';
import {
  selectBasket,
  removeItem,
  updateQuantity,
  postOrder,
  clearBasket,
  selectOrderStatus,
} from "../../redux/slices/basketSlice";
import OrderSuccessToast from "../../components/orderSuccessToast";
import BasketItemCard from "../../components/basketItemCard";
import OrderSummaryCard from "../../components/orderSummaryCard";
import style from "./styles.module.css";

const DISCOUNT_REQUEST_LS_KEY = 'petShopDiscountRequest';

function BasketPage() {
  const dispatch = useDispatch();
  const basketItems = useSelector(selectBasket);
  const orderStatus = useSelector(selectOrderStatus);
  const [discountStatus, setDiscountStatus] = useState('checking'); // 'checking', 'none', 'available', 'used'

  useEffect(() => {
    // Перевіряємо, чи має користувач право на знижку
    const discountRequestJSON = localStorage.getItem(DISCOUNT_REQUEST_LS_KEY);
    if (discountRequestJSON) {
      try {
        const discountRequest = JSON.parse(discountRequestJSON);
        setDiscountStatus(discountRequest.discountUsed ? 'used' : 'available');
      } catch (e) {
        console.error("Failed to parse discount request from localStorage", e);
        setDiscountStatus('used'); // На випадок пошкоджених даних, вважаємо знижку використаною
      }
    } else {
      setDiscountStatus('none');
    }
  }, []);

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const totalSum = basketItems.reduce((sum, item) => {
    const price = item.discont_price || item.price;
    return sum + price * item.quantity;
  }, 0);

  const hasDiscount = discountStatus === 'available';
  const discountAmount = hasDiscount ? totalSum * 0.05 : 0;
  const finalSum = totalSum - discountAmount;

  const handleOrder = async () => {
    if (basketItems.length === 0) {
      toast.error("Your basket is empty.");
      return;
    }

    const orderData = {
      items: basketItems.map(item => ({ id: item.id, quantity: item.quantity })),
      total: finalSum,
      discountApplied: hasDiscount,
    };

    try {
      await dispatch(postOrder(orderData)).unwrap();
      toast.custom(
        (t) => <OrderSuccessToast t={t} visible={t.visible} />,
        {
          duration: 5000,
          id: 'order-success-toast', // prevent duplicates
        });
      if (discountStatus === 'available') {
        // Позначаємо знижку як використану, а не видаляємо запис
        const discountRequestJSON = localStorage.getItem(DISCOUNT_REQUEST_LS_KEY);
        if (discountRequestJSON) {
          try {
            const discountRequest = JSON.parse(discountRequestJSON);
            discountRequest.discountUsed = true;
            localStorage.setItem(DISCOUNT_REQUEST_LS_KEY, JSON.stringify(discountRequest));
          } catch (e) {
            console.error("Failed to update discount status in localStorage", e);
          }
        }
      }
      dispatch(clearBasket());
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'An unknown error occurred.');
    }
  };

  return (
    <main className={style.main}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '40px', pb: '20px' }}>
        <Typography variant="h1" sx={{ fontSize: '64px', fontWeight: 700 }}>
          Shopping cart
        </Typography>
        <div className={style.divider}></div>
        <Button
          component={RouterLink}
          to="/products"
          variant="all-categories"
          sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
        >
          Back to the store
        </Button>
      </Box>

      {basketItems.length > 0 ? (
        <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
          {/* Left side: List of items */}
          <Grid item xs={12} md={8}>
            {basketItems.map((item) => (
              <BasketItemCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </Grid>
          {/* Right side: Order summary */}
          <Grid item xs={12} md={4} sx={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <OrderSummaryCard
              itemsCount={basketItems.length}
              totalSum={totalSum}
              finalSum={finalSum}
              discountStatus={discountStatus}
              onOrder={handleOrder}
              orderStatus={orderStatus}
              onDiscountSuccess={() => setDiscountStatus('available')}
            />
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ textAlign: "left", py: 8 }}>
          <Typography variant="h4" sx={{ color: 'text.secondary', mb: 4 }}>
            Looks like you have no items in your basket currently.
          </Typography>
          <Button
          component={RouterLink}
          to="/products"
          variant="cta"
          >
          Continue Shopping
        </Button>
        </Box>
      )}
    </main>
  );
}

export default BasketPage;