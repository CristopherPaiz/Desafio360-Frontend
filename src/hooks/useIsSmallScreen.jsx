import { useTheme, useMediaQuery } from "@mui/material";

const useIsSmallScreen = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};

export default useIsSmallScreen;
