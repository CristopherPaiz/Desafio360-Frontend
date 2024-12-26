import { Typography as MuiTypography } from "@mui/material";
import PropTypes from "prop-types";

const CustomTypography = ({ variant, children, align = "center", sx = {}, ...props }) => {
  return (
    <MuiTypography
      variant={variant}
      sx={{
        fontWeight: "bold",
        textAlign: align,
        m: 2,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

CustomTypography.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
  align: PropTypes.string,
  sx: PropTypes.object,
};

export default CustomTypography;
