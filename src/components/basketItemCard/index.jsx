import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { API_BASE_URL } from "../../redux";

function BasketItemCard({ item, onRemove, onQuantityChange }) {
  return (
    <Card
      key={item.id}
      sx={{
        display: "flex",
        mb: 2,
        position: "relative",
        borderRadius: '12px',
        border: '1px solid #DDDDDD',
        boxShadow: 'none',
      }}
    >
      <RouterLink to={`/products/${item.id}`}>
        <CardMedia
          component="img"
          sx={{ width: 200, height: 180, objectFit: "cover" }}
          image={`${API_BASE_URL}${item.image}`}
          alt={item.title}
        />
      </RouterLink>
      <Box sx={{ width: '1px', bgcolor: '#DDDDDD' }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography
            component={RouterLink}
            to={`/products/${item.id}`}
            variant="h6"
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' }, pr: 2 }}
          >
            {item.title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ButtonGroup
            sx={{
              height: 58,
              '& .MuiButtonGroup-grouped': {
                borderColor: '#DDDDDD',
              },
            }}
          >
            <Button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              sx={{
                width: 58,
                minWidth: 58,
                fontSize: '24px',
                color: '#DDDDDD',
              }}
            >
              -
            </Button>
            <Button
              disabled
              sx={{
                fontWeight: 600,
                fontSize: '20px',
                width: '84px',
                lineHeight: '130%',
                '&.Mui-disabled': {
                  color: 'text.primary',
                  borderColor: '#DDDDDD',
                },
              }}
            >
              {item.quantity}
            </Button>
            <Button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              sx={{
                width: 58,
                minWidth: 58,
                fontSize: '24px',
                color: '#DDDDDD',
              }}
            >
              +
            </Button>
          </ButtonGroup>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, ml: 4 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '40px',
                lineHeight: 1.1,
                color: '#282828',
              }}
            >
              ${(item.discont_price || item.price).toFixed(2)}
            </Typography>
            {item.discont_price && (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: 1.3,
                  color: '#8B8B8B',
                  textDecoration: 'line-through',
                }}
              >
                ${item.price.toFixed(2)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <IconButton
        onClick={() => onRemove(item.id)}
        aria-label="delete"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <ClearIcon />
      </IconButton>
    </Card>
  );
}

export default BasketItemCard;
