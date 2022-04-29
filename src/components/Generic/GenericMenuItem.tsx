import { MenuItem, ListItemIcon, IconProps } from "@mui/material";
import { useRouter } from "next/router";
import { ReactElement } from "react";


export type GenericMenuItemProps = {
  id?          : string,
  title        : string,
  icon         : ReactElement<IconProps>,
  redirectURL  : string,
  clickHandler?: () => void
}

export const GenericMenuItem = (props: GenericMenuItemProps) => {

  const router = useRouter();

  return (
    <>
      <MenuItem data-testid={`menu-item${props.id ?? ''}`} id={props.id} onClick={props.clickHandler ? props.clickHandler: () => { router.push( props.redirectURL ) }}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        {props.title}
      </MenuItem>
    </>
  )

}