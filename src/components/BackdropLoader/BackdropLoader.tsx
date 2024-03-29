import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material"


export const BackdropLoader = () => {

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <Stack gap={1} justifyContent="center" alignItems="center">
          <CircularProgress color="inherit" size={60} thickness={4} />
          <Typography>Loading...</Typography>
        </Stack>
      </Backdrop>
    </>
  )

}
