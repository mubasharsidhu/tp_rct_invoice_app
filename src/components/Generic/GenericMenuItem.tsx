import { MenuItem, ListItemIcon, IconProps } from "@mui/material";
import { useRouter } from "next/router";
import { ReactElement } from "react";


export type GenericMenuItemProps = {
  title      : string,
  icon       : ReactElement<IconProps>,
  redirectURL: string
}

export const GenericMenuItem = (props: GenericMenuItemProps) => {
  const router = useRouter();
  return (
    <>
      <MenuItem onClick={() => { router.push( props.redirectURL ) }}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        {props.title}
      </MenuItem>
    </>
  )
}