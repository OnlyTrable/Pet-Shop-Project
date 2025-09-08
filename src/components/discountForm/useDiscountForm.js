import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const DISCOUNT_REQUEST_LS_KEY = "petShopDiscountRequest";

export function useDiscountForm(onSuccess) {
  const location = useLocation();
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const nameIsValid = formValues.name.length >= 3;
    const phoneIsValid = /^\+\d{12}$/.test(formValues.phone);
    const emailIsValid =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
        formValues.email
      );
    setIsFormValid(nameIsValid && phoneIsValid && emailIsValid);
  }, [formValues]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    let error = "";
    switch (name) {
      case "name":
        if (value.length > 0 && value.length < 3)
          error = "Name must be at least 3 characters long.";
        break;
      case "phone":
        if (value.length > 0 && !/^\+\d{12}$/.test(value))
          error = "Format: +XXXXXXXXXXXX (12 digits)";
        break;
      case "email":
        if (
          value.length > 0 &&
          !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
            value
          )
        )
          error = "Please enter a valid email address.";
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
        const existingRequestJSON = localStorage.getItem(
          DISCOUNT_REQUEST_LS_KEY
        );

        if (existingRequestJSON) {
          const existingRequest = JSON.parse(existingRequestJSON);
          if (existingRequest.discountUsed) {
            toast.error("You have already used your one-time discount.");
            return;
          }
        }

        if (location.pathname === "/basket" && existingRequestJSON) {
          toast.success("Discount found and applied!");
          if (onSuccess) onSuccess();
          return;
        }

        localStorage.setItem(
          DISCOUNT_REQUEST_LS_KEY,
          JSON.stringify(formValues)
        );
        toast.success(
          "Your request has been sent! A 5% discount is available on your first order."
        );
        setFormValues({ name: "", phone: "", email: "" });
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to process discount request", error);
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.error("Please fill out the form correctly.");
    }
  };

  return {
    formValues,
    formErrors,
    isFormValid,
    handleInputChange,
    handleDiscountSubmit,
  };
}
