import { Logout } from "@mui/icons-material";
import { MenuItem, ListItemIcon } from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContextProvider";


export const LogoutMenuItem = () => {
  const { logout } = useAuthContext();
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