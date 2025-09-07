import { Link as RouterLink, useLocation, matchPath } from 'react-router-dom';
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

  // Special handling for product pages to show the category path
  const productPageMatch = matchPath('/products/:id', location.pathname);
  if (productPageMatch) {
    const productId = parseInt(productPageMatch.params.id, 10);
    const product = products.find(p => p.id === productId);
    if (product) {
      const category = categories.find(c => c.id === product.categoryId);
      if (category) {
        return (
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<BreadcrumbDivider />}
            sx={{
              padding: '8px 16px',
              '& .MuiBreadcrumbs-ol': { alignItems: 'center' },
              '& .MuiBreadcrumbs-separator': { mx: 0 },
            }}
          >
            <Button component={RouterLink} to="/" variant="breadcrumb">
              Main Page
            </Button>
            <Button component={RouterLink} to="/categories" variant="breadcrumb">
              Categories
            </Button>
            <Button component={RouterLink} to={`/categories/${category.id}`} variant="breadcrumb">
              {category.title}
            </Button>
            <Button
              variant="breadcrumb"
              sx={{
                color: 'text.primary',
                pointerEvents: 'none',
                '&:hover': { backgroundColor: 'transparent' },
              }}
            >
              {product.title}
            </Button>
          </Breadcrumbs>
        );
      }
    }
  }

  // Не показуємо "хлібні крихти" на головній сторінці та в кошику
  if (location.pathname === '/' || location.pathname === '/basket') {
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
        padding: '8px 16px',
        '& .MuiBreadcrumbs-ol': {
          alignItems: 'center',
        },
        '& .MuiBreadcrumbs-separator': {
          mx: 0, // Видаляє горизонтальні відступи
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