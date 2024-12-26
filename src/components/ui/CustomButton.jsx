import { Button, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const CustomButton = ({ loading, children, onClick, color = "primary", type = "button", ...props }) => {
  return (
    <Button type={type} fullWidth variant="contained" color={color} onClick={onClick} disabled={loading} sx={{ mt: 3 }} {...props}>
      {loading ? <CircularProgress size={24} /> : children}
    </Button>
  );
};

CustomButton.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  color: PropTypes.string,
  type: PropTypes.string,
};

export default CustomButton;
