import { useParams } from 'react-router-dom';
import style from './styles.module.css';

function ProductPage() {
  const { id } = useParams();

  return (
    <main className={style.main}>
      <h1>Product Page: {id}</h1>
      {/* Тут буде детальна інформація про продукт */}
    </main>
  );
}

export default ProductPage;