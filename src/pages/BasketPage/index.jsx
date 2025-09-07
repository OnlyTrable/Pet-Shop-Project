import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  selectBasket,
  removeItem,
  updateQuantity,
} from "../../redux/slices/basketSlice";
import { API_BASE_URL } from "../../redux";
import style from "./styles.module.css";

function BasketPage() {
  const dispatch = useDispatch();
  const basketItems = useSelector(selectBasket);

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
          sx={{ whiteSpace: 'nowrap' }}
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
                sx={{ display: "flex", mb: 2, position: "relative" }}
              >
                <RouterLink to={`/products/${item.id}`}>
                  <CardMedia
                    component="img"
                    sx={{ width: 151, height: 151, objectFit: "cover" }}
                    image={`${API_BASE_URL}${item.image}`}
                    alt={item.title}
                  />
                </RouterLink>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    component={RouterLink}
                    to={`/products/${item.id}`}
                    variant="h6"
                    sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {item.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <ButtonGroup>
                      <Button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <Button disabled>{item.quantity}</Button>
                      <Button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </ButtonGroup>
                    <Typography variant="h6" sx={{ mx: "auto" }}>
                      ${(item.discont_price || item.price).toFixed(2)}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      $
                      {(
                        (item.discont_price || item.price) * item.quantity
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => handleRemove(item.id)}
                  aria-label="delete"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <DeleteIcon />
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
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  Total: ${totalSum.toFixed(2)}
                </Typography>
                <Button variant="cta" fullWidth sx={{ mt: 2 }}>
                  Checkout
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