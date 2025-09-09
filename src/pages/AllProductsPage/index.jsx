import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from '@mui/material';
import {
  fetchProducts,
  selectProducts,
  selectProductsStatus,
} from '../../redux/slices/productsSlice';
import { addItem } from '../../redux/slices/basketSlice';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../redux';
import style from './styles.module.css';

function AllProductsPage() {
  const dispatch = useDispatch();

  // State for filters
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');

  // Selectors for data and status
  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);

  // Fetch data if not already present
  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    dispatch(addItem(product));
    toast.success(`${product.title} added to cart!`);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (products.length === 0) return [];

    let allProducts = [...products];

    if (showDiscounted) {
      allProducts = allProducts.filter(p => p.discont_price);
    }

    if (priceFrom) {
      allProducts = allProducts.filter(
        p => (p.discont_price || p.price) >= parseFloat(priceFrom)
      );
    }

    if (priceTo) {
      allProducts = allProducts.filter(
        p => (p.discont_price || p.price) <= parseFloat(priceTo)
      );
    }

    const sortedProducts = [...allProducts];
    switch (sortOrder) {
      case 'price_asc':
        sortedProducts.sort(
          (a, b) => (a.discont_price || a.price) - (b.discont_price || b.price)
        );
        break;
      case 'price_desc':
        sortedProducts.sort(
          (a, b) => (b.discont_price || b.price) - (a.discont_price || a.price)
        );
        break;
      case 'newest':
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
      case 'default':
      default:
        sortedProducts.sort((a, b) => a.id - b.id);
        break;
    }

    return sortedProducts;
  }, [products, showDiscounted, priceFrom, priceTo, sortOrder]);

  const handlePriceChange = (setter) => (event) => {
    const value = event.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  if (productsStatus === 'loading') {
    return (
      <Box className={style.center}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <main className={style.main}>
      <Typography variant="h1" sx={{ fontSize: '64px', fontWeight: 700, mb: '40px', textAlign: 'left' }}>
        All products
      </Typography>

      <Box className={style.filtersContainer}>
        <Box className={style.priceFilter}>
          <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Price</Typography>
          <TextField
            label="from"
            variant="outlined"
            value={priceFrom}
            onChange={handlePriceChange(setPriceFrom)}
            size="small"
            sx={{
              maxWidth: '112px',
            }}
          />
          <TextField
            label="to"
            variant="outlined"
            value={priceTo}
            onChange={handlePriceChange(setPriceTo)}
            size="small"
            sx={{
              maxWidth: '112px',
            }}
          />
        </Box>
        <FormControlLabel
          labelPlacement="start"
          control={
            <Checkbox
              checked={showDiscounted}
              onChange={e => setShowDiscounted(e.target.checked)}
            />
          }
          label={<Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Discounted items</Typography>}
        />
        <Box className={style.priceFilter}>
          <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Sorted by</Typography>
          <FormControl
            size="small"
            className={style.sortControl}
          >
            <Select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              displayEmpty
            >
              <MenuItem value="default">by default</MenuItem>
              <MenuItem value="newest">newest</MenuItem>
              <MenuItem value="price_asc">price: low-high</MenuItem>
              <MenuItem value="price_desc">price: high-low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box className={style.productsContainer}>
        {filteredAndSortedProducts.length > 0 ? (
          <div className={style.productsGrid}>
            {filteredAndSortedProducts.map(product => (
              <RouterLink to={`/products/${product.id}`} key={product.id} className={style.productCard}>
                <div className={style.productImageContainer}>
                  <div
                    className={style.productImage}
                    style={{ backgroundImage: `url(${API_BASE_URL}${product.image})` }}
                  />
                  {product.discont_price && (
                    <div className={style.discountBadge}>
                      -{Math.round(((product.price - product.discont_price) / product.price) * 100)}%
                    </div>
                  )}
                  <Button
                    className={style.addToCartButton}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to cart
                  </Button>
                </div>
                <p className={style.productTitle}>{product.title}</p>
                <div className={style.priceContainer}>
                  <p className={style.discountPrice}>${(product.discont_price || product.price).toFixed(2)}</p>
                  {product.discont_price && <p className={style.originalPrice}>${product.price.toFixed(2)}</p>}
                </div>
              </RouterLink>
            ))}
          </div>
        ) : (
          <Typography>No products match the criteria.</Typography>
        )}
      </Box>
    </main>
  );
}

export default AllProductsPage;