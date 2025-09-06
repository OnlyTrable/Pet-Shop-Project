import { useParams } from 'react-router-dom';
import style from './styles.module.css';

function CategoryPage() {
  const { id } = useParams();

  return (
    <main className={style.main}>
      <h1>Category: {id}</h1>
      {/* Тут буде список товарів з конкретної категорії */}
    </main>
  );
}

export default CategoryPage;