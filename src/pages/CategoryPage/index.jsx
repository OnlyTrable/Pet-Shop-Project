import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
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
import {
  fetchCategories,
  selectCategories,
  selectCategoriesStatus,
} from '../../redux/slices/categoriesSlice';
import { addItem } from '../../redux/slices/basketSlice';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../redux';
import ProductFilters from '../../components/productFilters';
import style from './styles.module.css';

function CategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // State for filters
  const [filters, setFilters] = useState({
    priceFrom: '',
    priceTo: '',
    showDiscounted: false,
    sortOrder: 'default',
  });

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
    toast.success(`${product.title} added to cart!`);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!category || products.length === 0) return [];

    let categoryProducts = products.filter(p => p.categoryId === category.id);

    if (filters.showDiscounted) {
      categoryProducts = categoryProducts.filter(p => p.discont_price);
    }

    if (filters.priceFrom) {
      categoryProducts = categoryProducts.filter(
        p => (p.discont_price || p.price) >= parseFloat(filters.priceFrom)
      );
    }

    if (filters.priceTo) {
      categoryProducts = categoryProducts.filter(
        p => (p.discont_price || p.price) <= parseFloat(filters.priceTo)
      );
    }

    const sortedProducts = [...categoryProducts];
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
  }, [products, category, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
      <Typography variant="h1" sx={{ fontSize: '64px', fontWeight: 700, mb: '40px', textAlign: 'left' }}>
        {category.title}
      </Typography>

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        showDiscountedFilter={true}
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