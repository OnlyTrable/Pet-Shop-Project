import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  ButtonGroup,
  CircularProgress,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import toast from 'react-hot-toast';
import {
  selectBasket,
  removeItem,
  updateQuantity,
  postOrder,
  clearBasket,
  selectOrderStatus,
} from "../../redux/slices/basketSlice";
import { API_BASE_URL } from "../../redux";
import style from "./styles.module.css";

const DISCOUNT_REQUEST_LS_KEY = 'petShopDiscountRequest';

function BasketPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const basketItems = useSelector(selectBasket);
  const orderStatus = useSelector(selectOrderStatus);

  const [hasDiscount, setHasDiscount] = useState(false);

  useEffect(() => {
    // Перевіряємо, чи має користувач право на знижку
    const discountRequest = localStorage.getItem(DISCOUNT_REQUEST_LS_KEY);
    setHasDiscount(!!discountRequest);
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

  const discountAmount = hasDiscount ? totalSum * 0.05 : 0;
  const finalSum = totalSum - discountAmount;

  const handleCheckout = async () => {
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
      toast.success('Your order has been placed successfully!');
      if (hasDiscount) {
        localStorage.removeItem(DISCOUNT_REQUEST_LS_KEY);
      }
      dispatch(clearBasket());
      navigate('/');
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
        <Grid container spacing={4}>
          {/* Left side: List of items */}
          <Grid item xs={12} md={8}>
            {basketItems.map((item) => (
              <Card
                key={item.id}
                sx={{
                  display: "flex",
                  mb: 2,
                  position: "relative",
                  borderRadius: '12px',
                  border: '1px solid #DDDDDD',
                  boxShadow: 'none',
                }}
              >
                <RouterLink to={`/products/${item.id}`}>
                  <CardMedia
                    component="img"
                    sx={{ width: 200, height: 180, objectFit: "cover" }}
                    image={`${API_BASE_URL}${item.image}`}
                    alt={item.title}
                  />
                </RouterLink>
                <Box sx={{ width: '1px', bgcolor: '#DDDDDD' }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    p: 2,
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography
                      component={RouterLink}
                      to={`/products/${item.id}`}
                      variant="h6"
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' }, pr: 2 }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ButtonGroup
                      sx={{
                        height: 58,
                        '& .MuiButtonGroup-grouped': {
                          borderColor: '#DDDDDD',
                        },
                      }}
                    >
                      <Button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        sx={{
                          width: 58,
                          minWidth: 58,
                          fontSize: '24px',
                          color: '#DDDDDD',
                        }}
                      >
                        -
                      </Button>
                      <Button
                        disabled
                        sx={{
                          fontWeight: 600,
                          fontSize: '20px',
                          width: '84px',
                          lineHeight: '130%',
                          '&.Mui-disabled': {
                            color: 'text.primary',
                            borderColor: '#DDDDDD',
                          },
                        }}
                      >
                        {item.quantity}
                      </Button>
                      <Button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        sx={{
                          width: 58,
                          minWidth: 58,
                          fontSize: '24px',
                          color: '#DDDDDD',
                        }}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, ml: 4 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '40px',
                          lineHeight: 1.1,
                          color: '#282828',
                        }}
                      >
                        ${(item.discont_price || item.price).toFixed(2)}
                      </Typography>
                      {item.discont_price && (
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: '20px',
                            lineHeight: 1.3,
                            color: '#8B8B8B',
                            textDecoration: 'line-through',
                          }}
                        >
                          ${item.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => handleRemove(item.id)}
                  aria-label="delete"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <ClearIcon />
                </IconButton>
              </Card>
            ))}
          </Grid>
          {/* Right side: Order summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Order details
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Items: ${totalSum.toFixed(2)}
                </Typography>
                {hasDiscount && (
                  <Typography variant="h6" sx={{ color: 'green' }}>
                    Discount (5%): -${discountAmount.toFixed(2)}
                  </Typography>
                )}
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold", borderTop: '1px solid #ddd', pt: 1 }}>
                  Total: ${finalSum.toFixed(2)}
                </Typography>
                <Button
                  variant="cta"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleCheckout}
                  disabled={orderStatus === 'loading'}
                >
                  {orderStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Checkout'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" sx={{ color: 'text.secondary' }}>
            Your basket is empty
          </Typography>
        </Box>
      )}
    </main>
  );
}

export default BasketPage;