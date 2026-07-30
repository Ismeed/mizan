export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 number, 1 uppercase
  const re = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
  return re.test(password);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
};
