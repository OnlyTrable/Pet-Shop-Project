import { useEffect, useMemo } from 'react';
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
import { API_BASE_URL } from '../../redux';
import discountImage from '../../assets/images/discount.png';

const HeroButton = styled(Button)({
  width: '218px',
  height: '58px',
  backgroundColor: '#0D50FF',
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '20px',
  padding: '16px 56px',
  borderRadius: '6px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#0D50AA',
  },
});

const AllCategoriesButton = styled(Button)({
  width: '142px',
  height: '36px',
  color: '#8B8B8B',
  fontWeight: 500,
  fontSize: '16px',
  padding: '8px 16px',
  border: '1px solid #DDDDDD',
  borderRadius: '6px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#282828',
    color: '#fff',
    borderColor: '#282828',
  },
});

const DiscountInput = styled(TextField)({
  backgroundColor: 'white',
  borderRadius: '6px',
  '& .MuiOutlinedInput-root fieldset': {
    border: 'none',
  },
});

const DiscountButton = styled(Button)({
  width: '100%',
  height: '58px',
  backgroundColor: '#FFFFFF',
  color: '#282828',
  fontWeight: 600,
  fontSize: '20px',
  borderRadius: '6px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

function MainPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const randomCategories = useMemo(() => {
    if (categories.length > 0) {
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    }
    return [];
  }, [categories]);

  const handleDiscountSubmit = (event) => {
    event.preventDefault();
    // Тут буде логіка для обробки форми
    console.log('Форма знижки відправлена!');
  };


  return (
    <main>
      <section className={style.heroSection}>
        <div className={style.heroContent}>
          <h1>Amazing Discounts on Pets Products!</h1>
          <HeroButton component={Link} to="/sales" variant="contained">
            Check out
          </HeroButton>
        </div>
      </section>
      <section className={style.categoriesSection}>
        <div className={style.categoriesHeader}>
          <h2 className={style.title}>Categories</h2>
          <div className={style.divider}></div>
          <AllCategoriesButton
            component={Link}
            to="/categories"
            variant="outlined"
          >
            All categories
          </AllCategoriesButton>
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
                variant="outlined"
                placeholder="Name"
                fullWidth
              />
              <DiscountInput
                variant="outlined"
                placeholder="Phone number"
                fullWidth
              />
              <DiscountInput
                variant="outlined"
                placeholder="Email"
                fullWidth
              />
              <DiscountButton
                variant="contained"
                type="submit"
              >
                Get a discount
              </DiscountButton>
            </form>
          </Grid>
        </Grid>
      </section>
    </main>
  );
}

export default MainPage;