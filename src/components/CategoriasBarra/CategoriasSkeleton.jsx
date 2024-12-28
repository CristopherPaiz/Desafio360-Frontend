import { Box, Skeleton, Stack, Paper } from "@mui/material";

const CategoriasSkeleton = () => {
  const CANTIDAD_ELEMENTOS = 10;
  const array = Array.from({ length: CANTIDAD_ELEMENTOS });

  return (
    <Paper elevation={1}>
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Stack
          direction="row"
          spacing={3}
          sx={{
            p: 2,
            minWidth: "max-content",
          }}
        >
          {array.map((_, index) => (
            <Stack
              key={index}
              alignItems="center"
              spacing={1}
              sx={{
                minWidth: 80,
              }}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={60} height={40} />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default CategoriasSkeleton;
