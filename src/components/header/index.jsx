import style from "./styles.module.css"
import { Link } from "react-router-dom"
import logo from "../../assets/icons/logo.svg"
import basket from "../../assets/icons/basket.svg"

function Header() {
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
                <img src={basket} alt="basket" />
            </Link>
        </header>
    )
}

export default Header;
