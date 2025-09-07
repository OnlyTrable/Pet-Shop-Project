import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  fetchCategories,
  selectCategories,
  selectCategoriesError,
  selectCategoriesStatus,
} from '../../redux/slices/categoriesSlice';
import { API_BASE_URL } from '../../redux';
import style from './styles.module.css';

function CategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    // Fetch categories only if they haven't been fetched yet
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <Box component="main" className={style.main}>
      <Typography variant="h1" className={style.title}>
        Categories
      </Typography>
      <div className={style.categoriesGrid}>
        {status === 'loading' && <p>Loading categories...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {status === 'succeeded' &&
          (categories.length > 0 ? (
            categories.map(category => (
              <Link to={`/categories/${category.id}`} key={category.id} className={style.categoryCard}>
                <div
                  className={style.categoryImage}
                  style={{ backgroundImage: `url(${API_BASE_URL}${category.image})` }}
                />
                <Typography component="p" className={style.categoryTitle}>
                  {category.title}
                </Typography>
              </Link>
            ))
          ) : (
            <p>No categories found.</p>
          ))}
      </div>
    </Box>
  );
}

export default CategoriesPage;