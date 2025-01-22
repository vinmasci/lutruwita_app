import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  FormContextType,
  FormProviderProps,
  FormValues,
  FormErrors,
  FormValidation,
  FormValue,
} from './types';

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

const validateField = (
  name: string,
  value: FormValue,
  validation?: FormValidation
): string => {
  if (!validation || !validation[name]) return '';

  const fieldValidation = validation[name];

  if (fieldValidation.required && !value && value !== false) {
    return 'This field is required';
  }

  if (fieldValidation.rules) {
    for (const rule of fieldValidation.rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
  }

  return '';
};

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialValues = {},
  validation,
  onSubmit,
}) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: string, value: FormValue) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value, validation);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validation]);

  const setTouched = useCallback((name: string) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name], validation);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [validation, values]);

  const setError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (validation) {
      Object.keys(validation).forEach((fieldName) => {
        const error = validateField(fieldName, values[fieldName], validation);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  }, [validation, values]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validateForm, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedFields({});
    setIsSubmitting(false);
  }, [initialValues]);

  const contextValue: FormContextType = {
    values,
    errors,
    touched: touchedFields,
    isSubmitting,
    setValue,
    setTouched,
    setError,
    clearError,
    handleSubmit,
    reset,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};
