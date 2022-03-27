import { Logout } from "@mui/icons-material";
import { MenuItem, ListItemIcon } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextProvider";


export const LogoutMenuItem = () => {
  const { logout } = useContext(AuthContext);
  return (
    <MenuItem onClick={ () => {
        logout();
      }}>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      Logout
    </MenuItem>
  )
}