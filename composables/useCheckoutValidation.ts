import { ref } from "vue";

export interface ValidationErrors {
  [key: string]: string;
}

export const useCheckoutValidation = () => {
  const validationErrors = ref<ValidationErrors>({});

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email || !email.trim()) {
      return "Имейлът е задължителен.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Моля, въведете валиден имейл адрес.";
    }
    return null;
  };

  const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value || !value.trim()) {
      return `${fieldName} е задължително поле.`;
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone || !phone.trim()) {
      return "Телефонът е задължителен.";
    }
    // Basic phone validation - allow digits, spaces, +, -, ()
    const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Моля, въведете валиден телефонен номер.";
    }
    return null;
  };

  const validateCity = (city: string): string | null => {
    if (!city || !city.trim()) {
      return "Градът е задължителен.";
    }
    if (city.trim().length < 2) {
      return "Градът трябва да бъде поне 2 символа.";
    }
    return null;
  };

  const validatePostalCode = (postalCode: string): string | null => {
    if (!postalCode || !postalCode.trim()) {
      return "Пощенският код е задължителен.";
    }
    // Bulgarian postal codes are 4 digits
    const postalCodeRegex = /^\d{4}$/;
    if (!postalCodeRegex.test(postalCode.trim())) {
      return "Пощенският код трябва да бъде 4 цифри (напр. 1000).";
    }
    return null;
  };

  // Validation handlers
  const validateField = (
    fieldName: string,
    value: string,
    validator: (val: string) => string | null
  ) => {
    const error = validator(value);
    if (error) {
      validationErrors.value[fieldName] = error;
    } else {
      delete validationErrors.value[fieldName];
    }
  };

  const handleBlur = (fieldName: string, value: string, fieldLabel?: string) => {
    switch (fieldName) {
      case "guestEmail":
      case "shippingEmail":
        validateField(fieldName, value, validateEmail);
        break;
      case "guestFirstName":
      case "shippingFirstName":
        validateField(fieldName, value, (val) => validateRequired(val, "Името"));
        break;
      case "guestLastName":
      case "shippingLastName":
        validateField(fieldName, value, (val) => validateRequired(val, "Фамилията"));
        break;
      case "guestPhone":
      case "shippingPhone":
        validateField(fieldName, value, validatePhone);
        break;
      case "shippingStreet":
        validateField(fieldName, value, (val) => validateRequired(val, "Адресът"));
        break;
      case "shippingCity":
        validateField(fieldName, value, validateCity);
        break;
      case "shippingPostalCode":
        validateField(fieldName, value, validatePostalCode);
        break;
      default:
        if (fieldLabel) {
          validateField(fieldName, value, (val) => validateRequired(val, fieldLabel));
        }
    }
  };

  const handleInput = (fieldName: string) => {
    // Clear error when user starts typing
    if (validationErrors.value[fieldName]) {
      delete validationErrors.value[fieldName];
    }
  };

  const clearErrors = () => {
    validationErrors.value = {};
  };

  const hasErrors = (): boolean => {
    return Object.keys(validationErrors.value).length > 0;
  };

  return {
    validationErrors,
    handleBlur,
    handleInput,
    clearErrors,
    hasErrors,
    validateEmail,
    validateRequired,
    validatePhone,
    validateCity,
    validatePostalCode,
  };
};

