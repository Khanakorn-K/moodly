export const validator = {
  isEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  isEmpty: (value: string | null | undefined): boolean => {
    return !value || value.trim().length === 0;
  },
  isMinLength: (value: string, min: number): boolean => {
    return value.trim().length >= min;
  },
  isThaiPhone: (phone: string): boolean => {
    const regex = /^0[689]\d{8}$/;
    return regex.test(phone);
  },
  isStrongPassword: (password: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  },
  isNumeric: (value: string): boolean => {
    const regex = /^\d+$/;
    return regex.test(value);
  },
  isUrl: (url: string): boolean => {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return regex.test(url);
  },
};
