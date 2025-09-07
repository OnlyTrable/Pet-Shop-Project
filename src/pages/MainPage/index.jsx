import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from './styles.module.css';
import { Link } from 'react-router-dom';
import { Button, Grid, TextField, styled } from '@mui/material';
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
import discountImage from '../../assets/images/discount.png';

const DiscountInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#FFFFFF', // Потрібний колір рамки
    },
    '&:hover fieldset': {
      borderColor: '#FFFFFF', // Колір рамки при наведенні
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFFFFF', // Колір рамки при фокусі
    },
    // Стилі для самого поля вводу
    '& .MuiInputBase-input': {
      color: '#FFFFFF', // Колір тексту, що вводиться
      '&::placeholder': {
        color: '#FFFFFF', // Колір плейсхолдера
        opacity: 1, // Забираємо прозорість плейсхолдера
      },
    },
    // Стилі для тексту-підказки (helperText)
    '& .MuiFormHelperText-root': {
      color: '#FFFFFF',
    },
  },
});

function MainPage() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);

  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const productsError = useSelector(selectProductsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, productsStatus, dispatch]);

  useEffect(() => {
    const nameIsValid = formValues.name.length >= 3;
    const phoneIsValid = /^\+\d{12}$/.test(formValues.phone);
    // A practical, robust regex for email validation based on RFC 5322.
    const emailIsValid = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(formValues.email);

    setIsFormValid(nameIsValid && phoneIsValid && emailIsValid);
  }, [formValues]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    let error = '';
    switch (name) {
      case 'name':
        if (value.length > 0 && value.length < 3) {
          error = 'Name must be at least 3 characters long.';
        }
        break;
      case 'phone':
        if (value.length > 0 && !/^\+\d{12}$/.test(value)) {
          error = 'Format: +XXXXXXXXXXXX (12 digits)';
        }
        break;
      case 'email':
        if (value.length > 0 && !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      default:
        break;
    }
    setFormErrors({ ...formErrors, [name]: error });
  };

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

  const handleDiscountSubmit = (event) => {
    event.preventDefault();
    if (isFormValid) {
      console.log('Форма знижки відправлена!', formValues);
      // Тут буде логіка для відправки даних на сервер
    } else {
      console.log('Форма містить помилки.');
    }
  };


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
            <form className={style.discountForm} onSubmit={handleDiscountSubmit}>
              <DiscountInput
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Name"
                fullWidth
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
              <DiscountInput
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Phone number"
                fullWidth
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />
              <DiscountInput
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Email"
                fullWidth
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <Button
                variant="discount"
                type="submit"
                disabled={!isFormValid}
              >
                Get a discount
              </Button>
            </form>
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
                    <Button className={style.addToCartButton}>Add to cart</Button>
                  </div>
                  <div className={style.priceContainer}>
                    <p className={style.discountPrice}>${product.discont_price.toFixed(2)}</p>
                    <p className={style.originalPrice}>${product.price.toFixed(2)}</p>
                  </div>
                  <p className={style.productTitle}>{product.title}</p>
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