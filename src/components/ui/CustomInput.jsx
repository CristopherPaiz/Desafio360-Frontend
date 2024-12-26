import { TextField, InputAdornment } from "@mui/material";
import PropTypes from "prop-types";

const CustomInput = ({
  label,
  type = "text",
  fullWidth = true,
  startIcon,
  endIcon,
  error = false,
  helperText = "",
  placeholder = "",
  sx = {},
  variant = "outlined",
  register = () => ({}),
  ...rest
}) => {
  return (
    <TextField
      margin="normal"
      fullWidth={fullWidth}
      label={label}
      type={type}
      error={error}
      placeholder={placeholder}
      helperText={helperText}
      variant={variant}
      sx={(sx, { my: 2 })}
      slotProps={{
        input: {
          startAdornment: startIcon && <InputAdornment position="start">{startIcon}</InputAdornment>,
          endAdornment: endIcon && <InputAdornment position="end">{endIcon}</InputAdornment>,
        },
      }}
      {...register}
      {...rest}
    />
  );
};

CustomInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
  variant: PropTypes.string,
  register: PropTypes.object,
};

export default CustomInput;
