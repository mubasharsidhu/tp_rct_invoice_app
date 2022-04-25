import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { PasswordField } from "../../components/PasswordField/PasswordField";
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

const loginSchema = yup.object({
  email   : yup.string().email("Email must be a valid email").required("Email is a required field"),
  password: yup.string().required("Password is a required field"),
}).required();

export type LoginInputs = {
  email   : string,
  password: string,
};

export type LoginFormProps = {
  genericError?     : string;
  onNavigateToSignUp: () => unknown
  onLoginRequest    : (data: LoginInputs) => unknown
}

export const LoginForm = (props: LoginFormProps) => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginInputs>({
    mode: "onBlur",
    resolver: yupResolver(loginSchema)
  });

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
          <Typography component="h1" variant="h5">Sign in</Typography>

          <Box
            id="login-form"
            component="form"
            noValidate
            sx={{ mt: 2 }}
            onSubmit={handleSubmit(props.onLoginRequest)}
          >
            {props.genericError ? <ErrorMessage message={props.genericError} /> : null}
            <TextField
              id="email"
              name="email"
              label="Email Address"
              required={true}
              fullWidth={true}
              margin="dense"
              inputProps={{...register("email", { required: true }) }}
              error={!!errors.email}
              helperText={errors.email?.message ?? " "}
            />
            <PasswordField
              fieldId="password"
              labelTitle="Password"
              inputProps={{...register("password", { required: true }) }}
              errorMessage={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth={true}
              variant="contained"
              >
              Sign In
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                Don't have an account?
                <Button variant="text" id="navigate-to-signup-button"
                  onClick={(ev) => {
                    ev.preventDefault();
                    props.onNavigateToSignUp();
                  }}
                >Sign Up</Button>
              </Grid>
            </Grid>

          </Box>
        </Box>
      </Container>
    </>
  )

}