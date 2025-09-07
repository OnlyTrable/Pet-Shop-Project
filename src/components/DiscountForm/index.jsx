import { Button, TextField, styled } from '@mui/material';
import { useDiscountForm } from '../../hooks/useDiscountForm';
import style from './styles.module.css';

const DarkInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#FFFFFF',
    },
    '&:hover fieldset': {
      borderColor: '#FFFFFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFFFFF',
    },
    '& .MuiInputBase-input': {
      color: '#FFFFFF',
      '&::placeholder': {
        color: '#FFFFFF',
        opacity: 1,
      },
    },
    '& .MuiFormHelperText-root': {
      color: '#FFFFFF',
    },
  },
});

const LightInput = styled(TextField)({
  // Uses default MUI styles for light background
});

function DiscountForm({ variant = 'dark', onSuccess }) {
  const {
    formValues,
    formErrors,
    isFormValid,
    handleInputChange,
    handleDiscountSubmit,
  } = useDiscountForm(onSuccess);

  const InputComponent = variant === 'dark' ? DarkInput : LightInput;
  const buttonText = variant === 'dark' ? 'Get a discount' : 'Check out';

  return (
    <form className={style.discountForm} onSubmit={handleDiscountSubmit}>
      <InputComponent name="name" value={formValues.name} onChange={handleInputChange} variant="outlined" placeholder="Name" fullWidth error={!!formErrors.name} helperText={formErrors.name} />
      <InputComponent name="phone" value={formValues.phone} onChange={handleInputChange} variant="outlined" placeholder="Phone number" fullWidth error={!!formErrors.phone} helperText={formErrors.phone} />
      <InputComponent name="email" value={formValues.email} onChange={handleInputChange} variant="outlined" placeholder="Email" fullWidth error={!!formErrors.email} helperText={formErrors.email} />
      <Button
        type="submit"
        disabled={!isFormValid}
        fullWidth
        sx={{
          height: '76px',
          fontSize: '28px',
          fontWeight: 700,
          textTransform: 'none',
          bgcolor: variant === 'dark' ? '#FFFFFF' : '#0D50FF',
          color: variant === 'dark' ? '#282828' : '#FFFFFF',
          '&:hover': {
            bgcolor: variant === 'dark' ? '#f0f0f0' : '#282828',
          },
        }}
      >
        {buttonText}
      </Button>
    </form>
  );
}

export default DiscountForm;