import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
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
import {
  fetchCategories,
  selectCategories,
  selectCategoriesStatus,
} from '../../redux/slices/categoriesSlice';
import { addItem } from '../../redux/slices/basketSlice';
import { API_BASE_URL } from '../../redux';
import style from './styles.module.css';

function CategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // State for filters
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');

  // Selectors for data and status
  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const categories = useSelector(selectCategories);
  const categoriesStatus = useSelector(selectCategoriesStatus);

  // Fetch data if not already present
  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [productsStatus, categoriesStatus, dispatch]);

  // Find the current category
  const category = useMemo(
    () => categories.find(cat => cat.id === parseInt(id, 10)),
    [categories, id]
  );

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    dispatch(addItem(product));
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!category || products.length === 0) return [];

    let categoryProducts = products.filter(p => p.categoryId === category.id);

    if (showDiscounted) {
      categoryProducts = categoryProducts.filter(p => p.discont_price);
    }

    if (priceFrom) {
      categoryProducts = categoryProducts.filter(
        p => (p.discont_price || p.price) >= parseFloat(priceFrom)
      );
    }

    if (priceTo) {
      categoryProducts = categoryProducts.filter(
        p => (p.discont_price || p.price) <= parseFloat(priceTo)
      );
    }

    const sortedProducts = [...categoryProducts];
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
      case 'default':
      default:
        sortedProducts.sort((a, b) => a.id - b.id);
        break;
    }

    return sortedProducts;
  }, [products, category, showDiscounted, priceFrom, priceTo, sortOrder]);

  const handlePriceChange = (setter) => (event) => {
    const value = event.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  if (categoriesStatus === 'loading' || productsStatus === 'loading') {
    return (
      <Box className={style.center}>
        <CircularProgress />
      </Box>
    );
  }

  if (!category) {
    return (
      <Box className={style.center}>
        <Typography variant="h5">Category not found.</Typography>
      </Box>
    );
  }

  return (
    <main className={style.main}>
      <Typography variant="h1" sx={{ fontSize: '64px', fontWeight: 700, mb: '40px' }}>
        {category.title}
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
              '& .MuiInputBase-root': {
                height: '36px',
              },
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
              '& .MuiInputBase-root': {
                height: '36px',
              },
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
            sx={{
              '& .MuiInputBase-root': {
                height: '36px',
              },
            }}
          >
            <Select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              displayEmpty
            >
              <MenuItem value="default">by default</MenuItem>
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

export default CategoryPage;