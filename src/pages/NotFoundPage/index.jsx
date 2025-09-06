import { Box, Button, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import style from './styles.module.css';
import likeZeroImage from '../../assets/images/like_zero.png';

const PageNotFoundTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '64px',
  letterSpacing: 0,
  textAlign: 'center',
  color: theme.palette.text.primary, // Використовуємо колір з теми
  marginBottom: '24px',
}));
const Body1 = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '20px',
  letterSpacing: 0,
  textAlign: 'center',
  color: theme.palette.tertiary.main, // Використовуємо колір з теми
}));
function NotFoundPage() {
  return (
    <Box component="main" className={style.main}>
      <div className={style.titleContainer}>
        <span className={style.titleDigit}>4</span>
        <img src={likeZeroImage} alt="0" className={style.titleImage} />
        <span className={style.titleDigit}>4</span>
      </div>
      <PageNotFoundTitle variant="h2">
        Page Not Found
      </PageNotFoundTitle>
      <Body1 variant="body1">
        We’re sorry, the page you requested could not be found.
      </Body1>
      <Body1 variant="body1">
        Please go back to the homepage.
      </Body1>
      <Button
        component={Link}
        to="/"
        variant="cta"
        sx={{ mt: 4, width: 'auto' }} // Додаємо відступ зверху через sx
      >
        Go Home
      </Button>
    </Box>
  );
}

export default NotFoundPage;