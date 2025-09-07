import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  ButtonGroup,
  Link,
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

function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);

  const product = useMemo(
    () => products.find(p => p.id === parseInt(id, 10)),
    [products, id]
  );

  const relatedProducts = useMemo(() => {
    if (!product || products.length <= 1) return [];
    return products
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [product, products]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addItem({ ...product, quantity }));
      toast.success(`${product.title} added to cart!`);
    }
  };


  if (productsStatus === 'loading') {
    return (
      <Box className={style.center}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className={style.center}>
        <Typography variant="h5">Product not found.</Typography>
      </Box>
    );
  }

  const discount = product.discont_price
    ? Math.round(((product.price - product.discont_price) / product.price) * 100)
    : 0;

  const finalPrice = product.discont_price || product.price;

  const DESCRIPTION_LIMIT = 200;
  const isLongDescription = product.description.length > DESCRIPTION_LIMIT;
  const displayedDescription = isDescriptionExpanded
    ? product.description
    : `${product.description.substring(0, DESCRIPTION_LIMIT)}${isLongDescription ? '...' : ''}`;

  return (
    <main className={style.main}>
      <Box className={style.productPageContainer}>
        {/* Left Column: Related Products */}
        <Box className={style.relatedProductsColumn}>
          {relatedProducts.map(p => (
            <RouterLink to={`/products/${p.id}`} key={p.id} className={style.relatedProductCard}>
              <img src={`${API_BASE_URL}${p.image}`} alt={p.title} className={style.relatedProductImage} />
            </RouterLink>
          ))}
        </Box>

        {/* Center Column: Main Image */}
        <Box className={style.mainImageWrapper}>
          <Box className={style.mainImageContainer}>
            <img src={`${API_BASE_URL}${product.image}`} alt={product.title} className={style.productImage} />
          </Box>
        </Box>

        {/* Right Column: Info */}
        <Box className={style.infoContainer}>
            <Typography variant="h1" className={style.title}>{product.title}</Typography>

            <Box className={style.priceSection}>
              <Typography className={style.finalPrice}>${finalPrice.toFixed(2)}</Typography>
              {product.discont_price && (
                <>
                  <Typography className={style.originalPrice}>${product.price.toFixed(2)}</Typography>
                  <Box className={style.discountBadge}>-{discount}%</Box>
                </>
              )}
            </Box>

            <Box className={style.actionsRow}>
              <ButtonGroup className={style.quantityControl}>
                <Button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className={style.quantityButton}
                >
                  -
                </Button>
                <Button disabled className={style.quantityDisplay}>{quantity}</Button>
                <Button
                  onClick={() => setQuantity(q => q + 1)}
                  className={style.quantityButton}
                >
                  +
                </Button>
              </ButtonGroup>
              <Button
                variant="cta"
                onClick={handleAddToCart}
                sx={{
                  height: '58px',
                  flexGrow: 1,
                  fontSize: '20px',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#282828', // Колір як на картках в категоріях
                  },
                }}
              >
                Add to cart
              </Button>
            </Box>

            <Box className={style.descriptionSection}>
              <Typography variant="h6" className={style.descriptionTitle}>Description</Typography>
              <Typography className={style.descriptionText}>{displayedDescription}</Typography>
              {isLongDescription && !isDescriptionExpanded && (
                <Link component="button" onClick={() => setIsDescriptionExpanded(true)} className={style.readMoreLink}>
                  Read more
                </Link>
              )}
            </Box>
        </Box>
      </Box>
    </main>
  );
}

export default ProductPage;
