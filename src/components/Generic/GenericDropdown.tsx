import { MoreVert } from "@mui/icons-material";
import { Box, Tooltip, IconButton, Menu } from "@mui/material";
import { useState } from "react";
import { GenericMenuItem, GenericMenuItemProps } from "./GenericMenuItem";


type GenericTableDropdownProps = {
  index     : number,
  menuItems?: Array<GenericMenuItemProps>
}

export const GenericTableDropdown = (props: GenericTableDropdownProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open                    = Boolean(anchorEl);
  const handleClick             = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        <Tooltip className="moreToolTip" title="Click for more options">
          <IconButton
            onClick={handleClick}
            sx={{ ml: 2 }}
            size="small"
            aria-controls={open ? `menu-${props.index}` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        className={"dropDownMoreMenu"}
        id={`menu-${props.index}`}
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
              right: 20,
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

          {
            props.menuItems
            ?
              props.menuItems.map((data, index) => {
                return (
                  <GenericMenuItem key={`menuItem-${index}`}
                    icon={data.icon}
                    title={data.title}
                    redirectURL={data.redirectURL}
                  />
                )
              })
            : null
          }

      </Menu>
    </>
  );

}