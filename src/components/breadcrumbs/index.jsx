import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../redux/slices/categoriesSlice';
import { selectProducts } from '../../redux/slices/productsSlice';
import style from './styles.module.css';

// Допоміжна функція для перетворення першої літери в велику
const capitalize = (s) => {
  if (typeof s !== 'string' || s.length === 0) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const BreadcrumbDivider = () => <div className={style.divider} />;

function BreadcrumbsComponent() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);

  // Не показуємо "хлібні крихти" на головній сторінці
  if (pathnames.length === 0) {
    return null;
  }

  const getBreadcrumbName = (pathSegment, index) => {
    const prevPathSegment = pathnames[index - 1];

    // Для динамічних шляхів, як-от /categories/5, шукаємо назву в Redux
    if (prevPathSegment === 'categories' && !isNaN(pathSegment)) {
      const category = categories.find(cat => cat.id === parseInt(pathSegment, 10));
      return category ? category.title : pathSegment;
    }

    if (prevPathSegment === 'products' && !isNaN(pathSegment)) {
      const product = products.find(prod => prod.id === parseInt(pathSegment, 10));
      return product ? product.title : pathSegment;
    }

    return capitalize(pathSegment);
  };

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<BreadcrumbDivider />}
      sx={{
        padding: '20px 40px',
        '& .MuiBreadcrumbs-ol': {
          alignItems: 'center',
        },
      }}
    >
      <Button component={RouterLink} to="/" variant="breadcrumb">
        Main Page
      </Button>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = getBreadcrumbName(value, index);

        return last ? (
          <Button
            key={to}
            variant="breadcrumb"
            sx={{
              color: 'text.primary', // Стиль для активної "крихти"
              pointerEvents: 'none', // Робимо її неінтерактивною
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            {name}
          </Button>
        ) : (
          <Button component={RouterLink} to={to} key={to} variant="breadcrumb">
            {name}
          </Button>
        );
      })}
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;