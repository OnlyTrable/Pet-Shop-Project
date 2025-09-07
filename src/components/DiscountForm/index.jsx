import { useState, useEffect } from 'react';
import { Button, TextField, styled } from '@mui/material';
import toast from 'react-hot-toast';
import style from './styles.module.css';

const DiscountInput = styled(TextField)({
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

const DISCOUNT_REQUEST_LS_KEY = 'petShopDiscountRequest';

function DiscountForm() {
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const nameIsValid = formValues.name.length >= 3;
    const phoneIsValid = /^\+\d{12}$/.test(formValues.phone);
    const emailIsValid = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(formValues.email);
    setIsFormValid(nameIsValid && phoneIsValid && emailIsValid);
  }, [formValues]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    let error = '';
    switch (name) {
      case 'name':
        if (value.length > 0 && value.length < 3) error = 'Name must be at least 3 characters long.';
        break;
      case 'phone':
        if (value.length > 0 && !/^\+\d{12}$/.test(value)) error = 'Format: +XXXXXXXXXXXX (12 digits)';
        break;
      case 'email':
        if (value.length > 0 && !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value)) error = 'Please enter a valid email address.';
        break;
      default:
        break;
    }
    setFormErrors({ ...formErrors, [name]: error });
  };

  const handleDiscountSubmit = (event) => {
    event.preventDefault();
    if (isFormValid) {
      try {
        localStorage.setItem(DISCOUNT_REQUEST_LS_KEY, JSON.stringify(formValues));
        toast.success('Your request has been sent! A 5% discount is available on your first order.');
        setFormValues({ name: '', phone: '', email: '' });
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    } else {
      toast.error('Please fill out the form correctly.');
    }
  };

  return (
    <form className={style.discountForm} onSubmit={handleDiscountSubmit}>
      <DiscountInput name="name" value={formValues.name} onChange={handleInputChange} variant="outlined" placeholder="Name" fullWidth error={!!formErrors.name} helperText={formErrors.name} />
      <DiscountInput name="phone" value={formValues.phone} onChange={handleInputChange} variant="outlined" placeholder="Phone number" fullWidth error={!!formErrors.phone} helperText={formErrors.phone} />
      <DiscountInput name="email" value={formValues.email} onChange={handleInputChange} variant="outlined" placeholder="Email" fullWidth error={!!formErrors.email} helperText={formErrors.email} />
      <Button variant="discount" type="submit" disabled={!isFormValid}>
        Get a discount
      </Button>
    </form>
  );
}

export default DiscountForm;