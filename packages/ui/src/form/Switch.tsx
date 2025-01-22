import React from 'react';
import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { useForm } from './FormContext';

export interface SwitchProps extends Omit<MuiSwitchProps, 'name' | 'checked' | 'onChange'> {
  name: string;
  label: string;
  helperText?: string;
}

export const Switch: React.FC<SwitchProps> = ({
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
          <MuiSwitch
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
