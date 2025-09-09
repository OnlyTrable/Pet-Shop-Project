import { Box, Typography, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const OrderSuccessToast = ({ t, visible }) => {
  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(40, 40, 40, 0.4)', // #28282866
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '316px',
        zIndex: 1301, // Higher than MUI's modal zIndex
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 200ms ease-in-out',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '548px',
          height: '236px',
          borderRadius: '12px',
          gap: '16px',
          padding: '32px',
          bgcolor: '#0D50FF',
          color: '#FFFFFF',
          boxSizing: 'border-box',
          position: 'relative',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '424px',
            gap: '24px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '40px',
              lineHeight: '110%',
              color: '#FFFFFF',
            }}
          >
            Congratulations!
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '110%',
              color: '#FFFFFF',
            }}
          >
            Your order has been successfully placed on the website.
            <br /><br />
            A manager will contact you shortly to confirm your order.
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={() => toast.dismiss(t.id)}
          sx={{ position: 'absolute', top: 32, right: 32, color: '#FFFFFF' }}
        >
          <ClearIcon />
        </IconButton>
      </Box>
    </Box>
    , document.body
  );
};

export default OrderSuccessToast;