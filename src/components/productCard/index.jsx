import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import style from './styles.module.css';
import { API_BASE_URL } from '../../redux';

function ProductCard({ product, onAddToCart }) {
  const theme = useTheme();
  const cardStyles = {
    '--primary-main': theme.palette.primary.main,
    '--primary-contrast-text': theme.palette.primary.contrastText,
    '--text-primary': theme.palette.text.primary,
    '--tertiary-main': theme.palette.tertiary.main,
    '--divider-color': '#dddddd', // Corresponds to the border color
  };
  const { id, image, title, price, discont_price } = product;

  const discount = discont_price
    ? Math.round(((price - discont_price) / price) * 100)
    : 0;

  const finalPrice = discont_price || price;

  const handleAddToCart = (event) => {
    // Prevent the Link from navigating
    event.preventDefault();
    event.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Link to={`/products/${id}`} className={style.productCard} style={cardStyles}>
      <div className={style.productImageContainer}>
        <div
          className={style.productImage}
          style={{ backgroundImage: `url(${API_BASE_URL}${image})` }}
        />
        {discount > 0 && (
          <div className={style.discountBadge}>
            -{discount}%
          </div>
        )}
        <Button
          onClick={handleAddToCart}
          className={style.addToCartButton}
          variant="cta"
        >
          Add to cart
        </Button>
      </div>
      <p className={style.productTitle} title={title}>
        {title}
      </p>
      <div className={style.priceContainer}>
        <p className={style.discountPrice}>${finalPrice.toFixed(2)}</p>
        {discont_price && (
          <p className={style.originalPrice}>${price.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
