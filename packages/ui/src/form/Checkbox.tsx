import React from 'react';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { useForm } from './FormContext';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'name' | 'checked' | 'onChange'> {
  name: string;
  label: string;
  helperText?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  helperText,
  onBlur,
  ...props
}) => {
  const { values, errors, touched, setValue, setTouched } = useForm();

  const handleChange = (_: unknown, checked: boolean) => {
    setValue(name, checked);
  };

  const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    setTouched(name);
    onBlur?.(event);
  };

  const error = touched[name] && errors[name];
  const displayHelperText = error || helperText;

  return (
    <FormControl error={!!error}>
      <FormControlLabel
        control={
          <MuiCheckbox
            {...props}
            name={name}
            checked={!!values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        }
        label={label}
      />
      {displayHelperText && (
        <FormHelperText>{displayHelperText}</FormHelperText>
      )}
    </FormControl>
  );
};
