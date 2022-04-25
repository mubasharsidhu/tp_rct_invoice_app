import { Box, Typography, Tooltip, IconButton, Avatar, Menu, Grid } from "@mui/material"
import React from "react"
import { GenericMenuItem } from "../components/Generic/GenericMenuItem";
import { LogoutMenuItemContainer } from "../containers/LogoutMenuItemContainer/LogoutMenuItemContainer";
import { useAuthContext } from "../contexts/AuthContextProvider";
import SettingsIcon from '@mui/icons-material/Settings';

export const Header = () => {

  const authData                = useAuthContext();
  const userName                = authData.meData?.name;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open                    = Boolean(anchorEl);
  const handleClick             = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid
        container
        borderRadius={1}
        bgcolor={'primary.light'}
        color={'primary.contrastText'}
        sx={{ mt:2, px: 2, py: 0 }}
      >
        <Grid item xs={4}><h3>Invoice Manager </h3></Grid>
        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-end"  }}>
          <Box
            id="settings-menu"
          >
            <Tooltip title="Click to open Settings">
              <IconButton
                onClick={handleClick}
                sx={{ ml: 2 }}
                size="large"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Typography sx={{ minWidth: 100, color: 'primary.contrastText' }}>{userName}</Typography>
                <Avatar sx={{ width: 32, height: 32 }}>{userName?.charAt(0)}</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 50,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >

            <GenericMenuItem key={`menuItem-company-details`}
              icon={<SettingsIcon fontSize="small" />}
              title={"Edit Company"}
              redirectURL={`/signup/edit/company`}
            />

            <LogoutMenuItemContainer />

          </Menu>
        </Grid>
      </Grid>
    </>
  )

}
