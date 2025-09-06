import { Box, Button, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import style from './styles.module.css';
import likeZeroImage from '../../assets/images/like_zero.png';

const HomeButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: '12px 24px',
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  backgroundColor: '#0D50FF',
  '&:hover': {
    backgroundColor: '#0D50AA',
  },
}));

function NotFoundPage() {
  return (
    <Box component="main" className={style.main}>
      <div className={style.titleContainer}>
        <span className={style.titleDigit}>4</span>
        <img src={likeZeroImage} alt="0" className={style.titleImage} />
        <span className={style.titleDigit}>4</span>
      </div>
      <Typography variant="h2" component="h2" className={style.pageNotFoundTitle}>
        Page Not Found
      </Typography>
      <Typography variant="h5" component="p" className={style.subtitle}>
        We’re sorry, the page you requested could not be found.
      </Typography>
      <Typography variant="body1" className={style.text}>
        Please go back to the homepage.
      </Typography>
      <HomeButton component={Link} to="/" variant="contained">
        Go Home
      </HomeButton>
    </Box>
  );
}

export default NotFoundPage;