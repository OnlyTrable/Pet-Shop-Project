import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
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
import ProductFilters from '../../components/productFilters';
import style from './styles.module.css';

function SalesPage() {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    priceFrom: '',
    priceTo: '',
    showDiscounted: false, // Not used here, but good for consistency
    sortOrder: 'default',
  });

  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);

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

  const filteredAndSortedProducts = useMemo(() => {
    if (products.length === 0) return [];

    let saleProducts = products.filter(p => p.discont_price);

    if (filters.priceFrom) {
      saleProducts = saleProducts.filter(
        p => (p.discont_price || p.price) >= parseFloat(filters.priceFrom)
      );
    }

    if (filters.priceTo) {
      saleProducts = saleProducts.filter(
        p => (p.discont_price || p.price) <= parseFloat(filters.priceTo)
      );
    }

    const sortedProducts = [...saleProducts];
    switch (filters.sortOrder) {
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
  }, [products, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
        Discounted items
      </Typography>

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        showDiscountedFilter={false}
      />

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
                  <div className={style.discountBadge}>
                    -{Math.round(((product.price - product.discont_price) / product.price) * 100)}%
                  </div>
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

export default SalesPage;