import { ReactNode } from 'react';

export type FormValue = string | number | boolean | null;

export type FormValues = Record<string, FormValue>;

export type FormErrors = Record<string, string>;

export type ValidationRule = {
  validate: (value: FormValue) => boolean;
  message: string;
};

export type FieldValidation = {
  required?: boolean;
  rules?: ValidationRule[];
};

export type FormValidation = Record<string, FieldValidation>;

export type FormContextType = {
  values: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  setValue: (name: string, value: FormValue) => void;
  setTouched: (name: string) => void;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
};

export type FormProviderProps = {
  children: ReactNode;
  initialValues?: FormValues;
  validation?: FormValidation;
  onSubmit: (values: FormValues) => Promise<void> | void;
};
