import { Button, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const CustomButton = ({
  loading,
  children,
  onClick,
  fullWidth = false,
  width = 200,
  color = "primary",
  type = "button",
  align = "center",
  mt = 2,
  ...props
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        width: "100%",
      }}
    >
      <Button
        type={type}
        fullWidth={fullWidth}
        variant="contained"
        color={color}
        onClick={onClick}
        disabled={loading}
        sx={{
          mt: mt,
          p: 1.5,
          width: fullWidth ? "100%" : width,
        }}
        {...props}
      >
        {loading ? <CircularProgress size={24} /> : children}
      </Button>
    </div>
  );
};

CustomButton.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  color: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  fullWidth: PropTypes.bool,
  align: PropTypes.oneOf(["left", "center", "right"]),
  mt: PropTypes.number,
};

export default CustomButton;
