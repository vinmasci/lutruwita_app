import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { useForm } from './FormContext';
import { FormValue } from './types';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'name' | 'value' | 'onChange' | 'error'> {
  name: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  onBlur,
  ...props
}) => {
  const { values, errors, touched, setValue, setTouched } = useForm();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as FormValue;
    setValue(name, value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTouched(name);
    onBlur?.(event);
  };

  const error = touched[name] && errors[name];

  return (
    <MuiTextField
      {...props}
      name={name}
      value={values[name] || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!error}
      helperText={error || props.helperText}
    />
  );
};
