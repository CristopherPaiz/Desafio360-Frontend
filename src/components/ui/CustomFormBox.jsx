import { Box, Container, Paper } from "@mui/material";
import useIsSmallScreen from "../../hooks/useIsSmallScreen";
import PropTypes from "prop-types";

const FormBox = ({ children }) => {
  const isSmallScreen = useIsSmallScreen();

  return (
    <Box
      sx={{
        minHeight: "95vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: isSmallScreen ? 4 : 6,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

FormBox.propTypes = {
  children: PropTypes.node,
};

export default FormBox;
