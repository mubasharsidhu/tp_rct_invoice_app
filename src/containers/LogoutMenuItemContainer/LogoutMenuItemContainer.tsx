import { Logout } from "@mui/icons-material";
import { MenuItem, ListItemIcon } from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContextProvider";


export const LogoutMenuItemContainer = () => {

  const { logout } = useAuthContext();

  return (
    <MenuItem className="logout" onClick={ () => {
        logout();
      }}>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      Logout
    </MenuItem>
  )

}