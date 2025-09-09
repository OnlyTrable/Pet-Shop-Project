import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import style from './styles.module.css';

function ProductFilters({ filters, onFilterChange, showDiscountedFilter = true }) {
  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    if (field.startsWith('price') && !(value === '' || /^\d*\.?\d*$/.test(value))) {
      return;
    }
    onFilterChange({ ...filters, [field]: value });
  };

  const handleCheckboxChange = (event) => {
    onFilterChange({ ...filters, showDiscounted: event.target.checked });
  };

  return (
    <Box className={style.filtersContainer}>
      <Box className={style.priceFilter}>
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Price</Typography>
        <TextField
          label="from"
          variant="outlined"
          value={filters.priceFrom}
          onChange={handleFieldChange('priceFrom')}
          size="small"
          sx={{ maxWidth: '112px' }}
        />
        <TextField
          label="to"
          variant="outlined"
          value={filters.priceTo}
          onChange={handleFieldChange('priceTo')}
          size="small"
          sx={{ maxWidth: '112px' }}
        />
      </Box>
      {showDiscountedFilter && (
        <FormControlLabel
          labelPlacement="start"
          control={
            <Checkbox
              sx={{
                color: 'transparent',
                '& .MuiSvgIcon-root': {
                  fontSize: 40,
                  border: '1px solid #DDDDDD',
                  borderRadius: '6px',
                },
                '&.Mui-checked': {
                  color: 'primary.main',
                  '& .MuiSvgIcon-root': {
                    border: '1px solid transparent',
                  },
                },
              }}
              checked={filters.showDiscounted}
              onChange={handleCheckboxChange}
            />
          }
          label={<Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Discounted items</Typography>}
        />
      )}
      <Box className={style.priceFilter}>
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Sorted by</Typography>
        <FormControl size="small" className={style.sortControl}>
          <Select value={filters.sortOrder} onChange={handleFieldChange('sortOrder')} displayEmpty>
            <MenuItem value="default">by default</MenuItem>
            <MenuItem value="newest">newest</MenuItem>
            <MenuItem value="price_asc">price: low-high</MenuItem>
            <MenuItem value="price_desc">price: high-low</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default ProductFilters;
