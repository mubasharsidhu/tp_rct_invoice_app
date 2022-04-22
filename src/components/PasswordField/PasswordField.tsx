import { VisibilityOff, Visibility } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { MouseEventHandler, useState } from "react";


export type PasswordFieldProps = {
  fieldId      : string
  labelTitle   : string;
  inputProps?  : React.InputHTMLAttributes<HTMLInputElement> & { [key: string]: any }
  errorMessage?: string;
}

export const PasswordField = (props: PasswordFieldProps) => {

  const [currentType, setCurrentType] = useState("password")

  const handleClickEyeIcon: MouseEventHandler = (ev) => {
    ev.preventDefault();
    setCurrentType((s) => s === 'text' ? "password" : "text")
  }

  return (
    <>
      <FormControl fullWidth={true} required={true} variant="outlined" margin="dense">
        <InputLabel htmlFor={props.fieldId}>{props.labelTitle}</InputLabel>
        <OutlinedInput
          margin="dense"
          id={props.fieldId}
          label={props.labelTitle}
          type={currentType}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickEyeIcon}
                onMouseDown={handleClickEyeIcon}
                edge="end"
              >
                {currentType === 'text'  ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          inputProps={{...props.inputProps}}
          error={!!props.errorMessage}
          aria-describedby="outlined-password-helper-text"
        />
        <FormHelperText id="outlined-password-helper-text" error={!!props.errorMessage}>
          {props.errorMessage ? props.errorMessage : " "}
        </FormHelperText>
      </FormControl>
    </>
  )

}
