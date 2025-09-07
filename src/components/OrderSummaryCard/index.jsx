import {
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import DiscountForm from "../DiscountForm/index.jsx";

function OrderSummaryCard({
  itemsCount,
  totalSum,
  finalSum,
  hasDiscount,
  onOrder,
  orderStatus,
  onDiscountSuccess
}) {
  return (
    <Card
      sx={{
        width: 548,
        minHeight: 582,
        borderRadius: '12px',
        padding: '32px',
        bgcolor: '#F1F3F4',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '40px',
          lineHeight: 1.1,
          color: '#282828',
        }}
      >
        Order details
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '40px',
            lineHeight: 1.3,
            color: '#8B8B8B',
          }}
        >
          {itemsCount} items
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '40px',
            lineHeight: 1.3,
            color: '#8B8B8B',
          }}
        >
          ${totalSum.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 'auto' }}>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '40px',
            lineHeight: 1.3,
          }}
        >
          Total
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: 1.1,
            color: '#282828',
          }}
        >
          ${finalSum.toFixed(2)}
        </Typography>
      </Box>

      {hasDiscount ? (
        <Button variant="cta" fullWidth sx={{ height: '76px', fontSize: '28px', fontWeight: 700, textTransform: 'none', bgcolor: '#0D50FF', '&:hover': { bgcolor: '#282828' } }} onClick={onOrder} disabled={orderStatus === 'loading'}>
          {orderStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Order'}
        </Button>
      ) : (
        <DiscountForm variant="light" onSuccess={onDiscountSuccess} />
      )}
    </Card>
  );
}

export default OrderSummaryCard;

