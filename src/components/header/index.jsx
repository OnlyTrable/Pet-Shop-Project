import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge } from '@mui/material';
import { selectTotalBasketItems } from '../../redux/slices/basketSlice';
import style from './styles.module.css';
import logo from '../../assets/icons/logo.svg';
import basket from '../../assets/icons/basket.svg';

function Header() {
  const totalItems = useSelector(selectTotalBasketItems);

    return (
        <header className={style.header}>
            <Link to="/" className={style.logo}>
                <img src={logo} alt="Pet-Shop Logo" />
            </Link>
            <nav className={style.nav}>
                <ul className={style.menu}>
                    <li>
                        <Link to="/">Main Page</Link>
                    </li>
                    <li>
                        <Link to="/categories">Categories</Link>
                    </li>
                    <li>
                        <Link to="/products">All products</Link>
                    </li>
                    <li>
                        <Link to="/sales">All sales</Link>
                    </li>
                </ul>
            </nav>
            <Link to="/basket" className={style.basket}>
                <Badge
                  badgeContent={totalItems}
                  color="primary"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  invisible={totalItems === 0}
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 26,
                      height: 26,
                      minWidth: 26,
                      borderRadius: '50%',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      top: -6,
                      left: 13,
                    },
                  }}
                >
                    <img src={basket} alt="basket" />
                </Badge>
            </Link>
        </header>
    )
}

export default Header;
