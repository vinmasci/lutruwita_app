import React from 'react';
import {
  RadioGroup as MuiRadioGroup,
  RadioGroupProps as MuiRadioGroupProps,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { useForm } from './FormContext';
import { FormValue } from './types';

export interface RadioGroupProps extends Omit<MuiRadioGroupProps, 'name' | 'value' | 'onChange'> {
  name: string;
  label?: string;
  helperText?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  helperText,
  onBlur,
  children,
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
  const displayHelperText = error || helperText;

  return (
    <FormControl error={!!error} component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <MuiRadioGroup
        {...props}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        {children}
      </MuiRadioGroup>
      {displayHelperText && (
        <FormHelperText>{displayHelperText}</FormHelperText>
      )}
    </FormControl>
  );
};
