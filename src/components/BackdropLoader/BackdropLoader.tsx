import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material"


export const BackdropLoader = () => {

  return (
    <>
      <Backdrop
        sx={{ color: 'primary.light', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <Stack gap={1} justifyContent="center" alignItems="center">
          <CircularProgress color="inherit" size={60} thickness={6} />
          <Typography>Loading...</Typography>
        </Stack>
      </Backdrop>
    </>
  )

}
