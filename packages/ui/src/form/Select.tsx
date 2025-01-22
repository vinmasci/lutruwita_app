import React from 'react';
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
  FormControl,
  FormHelperText,
  InputLabel,
} from '@mui/material';
import { useForm } from './FormContext';
import { FormValue } from './types';

export interface SelectProps extends Omit<MuiSelectProps, 'name' | 'value' | 'onChange' | 'error'> {
  name: string;
  label?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  helperText,
  onBlur,
  children,
  ...props
}) => {
  const { values, errors, touched, setValue, setTouched } = useForm();

  const handleChange = (event: SelectChangeEvent<unknown>) => {
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
    <FormControl error={!!error} fullWidth={props.fullWidth}>
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        {...props}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        label={label}
      >
        {children}
      </MuiSelect>
      {displayHelperText && (
        <FormHelperText>{displayHelperText}</FormHelperText>
      )}
    </FormControl>
  );
};
