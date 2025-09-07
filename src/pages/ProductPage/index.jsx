import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  fetchProducts,
  selectProducts,
  selectProductsStatus,
} from '../../redux/slices/productsSlice';
import { API_BASE_URL } from '../../redux';
import style from './styles.module.css';

function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);

  const product = useMemo(
    () => products.find(p => p.id === parseInt(id, 10)),
    [products, id]
  );

  if (productsStatus === 'loading') {
    return (
      <Box className={style.center}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className={style.center}>
        <Typography variant="h5">Product not found.</Typography>
      </Box>
    );
  }

  const discount = product.discont_price
    ? Math.round(((product.price - product.discont_price) / product.price) * 100)
    : 0;

  const finalPrice = product.discont_price || product.price;

  return (
    <main className={style.main}>
      <Grid container spacing={8} className={style.productContainer}>
        <Grid item xs={12} md={7}>
          <Box className={style.imageContainer}>
            <img src={`${API_BASE_URL}${product.image}`} alt={product.title} className={style.productImage} />
            {discount > 0 && (
              <div className={style.discountBadge}>
                -{discount}%
              </div>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box className={style.infoContainer}>
            <Typography variant="h1" className={style.title}>{product.title}</Typography>
            <Box className={style.priceSection}>
              <Typography className={style.finalPrice}>${finalPrice.toFixed(2)}</Typography>
              {product.discont_price && <Typography className={style.originalPrice}>${product.price.toFixed(2)}</Typography>}
            </Box>
            <Button variant="contained" className={style.addToCartButton}>Add to cart</Button>
            <Box className={style.descriptionSection}>
              <Typography variant="h6" className={style.descriptionTitle}>Description</Typography>
              <Typography className={style.descriptionText}>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </main>
  );
}

export default ProductPage;
