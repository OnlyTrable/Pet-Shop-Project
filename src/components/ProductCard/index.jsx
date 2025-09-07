import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import style from './styles.module.css';
import { API_BASE_URL } from '../../redux';

function ProductCard({ product }) {
  const discount = product.discont_price
    ? Math.round(((product.price - product.discont_price) / product.price) * 100)
    : 0;

  const finalPrice = product.discont_price || product.price;

  return (
    <Link to={`/products/${product.id}`} className={style.productCard}>
      <div className={style.productImageContainer}>
        <div
          className={style.productImage}
          style={{ backgroundImage: `url(${API_BASE_URL}${product.image})` }}
        />
        {discount > 0 && (
          <div className={style.discountBadge}>
            -{discount}%
          </div>
        )}
        <Button
          className={style.addToCartButton}
          sx={{
            backgroundColor: '#339933',
            color: 'white',
            borderRadius: '6px',
            padding: '12px 24px',
            textTransform: 'none',
            fontSize: '18px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#2b802b',
            },
          }}
        >
          Add to cart
        </Button>
      </div>
      <p className={style.productTitle}>{product.title}</p>
      <div className={style.priceContainer}>
        <p className={style.discountPrice}>${finalPrice.toFixed(2)}</p>
        {product.discont_price && (
          <p className={style.originalPrice}>${product.price.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
