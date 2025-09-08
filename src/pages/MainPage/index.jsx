import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/basketSlice';
import style from './styles.module.css';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import {
  fetchCategories,
  selectCategories,
  selectCategoriesError,
  selectCategoriesStatus,
} from '../../redux/slices/categoriesSlice';
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../../redux/slices/productsSlice';
import { API_BASE_URL } from '../../redux';
import DiscountForm from '../../components/discountForm';
import discountImage from '../../assets/images/discount.png';

function MainPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);

  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const productsError = useSelector(selectProductsError);

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    dispatch(addItem(product));
    toast.success(`${product.title} added to cart!`);
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, productsStatus, dispatch]);

  const randomCategories = useMemo(() => {
    if (categories.length > 0) {
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    }
    return [];
  }, [categories]);

  const saleProducts = useMemo(() => {
    if (products.length > 0) {
      const discounted = products.filter(product => product.discont_price);
      const shuffled = [...discounted].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    }
    return [];
  }, [products]);

  return (
    <main>
      <section className={style.heroSection}>
        <div className={style.heroContent}>
          <h1>Amazing Discounts on Pets Products!</h1>
          <Button component={Link} to="/sales" variant="cta">
            Check out
          </Button>
        </div>
      </section>
      <section className={style.categoriesSection}>
        <div className={style.categoriesHeader}>
          <h2 className={style.title}>Categories</h2>
          <div className={style.divider}></div>
          <Button
            component={Link}
            to="/categories"
            variant="all-categories"
          >
            All categories
          </Button>
        </div>
        <div className={style.categoriesGrid}>
          {status === 'loading' && <p>Loading categories...</p>}
          {status === 'failed' && <p>Error: {error}</p>}
          {status === 'succeeded' &&
            (randomCategories.length > 0 ? (
              randomCategories.map(category => (
                <Link to={`/categories/${category.id}`} key={category.id} className={style.categoryCard}>
                  <div
                    className={style.categoryImage}
                    style={{ backgroundImage: `url(${API_BASE_URL}${category.image})` }}
                  />
                  <p>{category.title}</p>
                </Link>
              ))
            ) : (
              <p>No categories found.</p>
            ))}
        </div>
      </section>
      <section className={style.discountSection}>
        <h2 className={style.discountTitle}>5% off on the first order</h2>
        <Grid container alignItems="center" spacing={{ xs: 2, md: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <img
              src={discountImage}
              alt="Discount on first order"
              className={style.discountImage}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <DiscountForm />
          </Grid>
        </Grid>
      </section>
            <section className={style.saleSection}>
        <div className={style.categoriesHeader}>
          <h2 className={style.title}>Sale</h2>
          <div className={style.divider}></div>
          <Button
            component={Link}
            to="/sales"
            variant="all-categories"
          >
            All sales
          </Button>
        </div>
        <div className={style.categoriesGrid}>
          {productsStatus === 'loading' && <p>Loading products...</p>}
          {productsStatus === 'failed' && <p>Error: {productsError}</p>}
          {productsStatus === 'succeeded' &&
            (saleProducts.length > 0 ? (
              saleProducts.map(product => (
                <Link to={`/products/${product.id}`} key={product.id} className={style.productCard}>
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
                    <p className={style.discountPrice}>${product.discont_price.toFixed(2)}</p>
                    <p className={style.originalPrice}>${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No sale products found.</p>
            ))}
        </div>
      </section>
    </main>
  );
}

export default MainPage;