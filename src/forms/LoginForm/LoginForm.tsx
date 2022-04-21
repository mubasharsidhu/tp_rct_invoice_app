import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { PasswordField } from "../../components/PasswordField/PasswordField";
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

const loginSchema = yup.object({
  email   : yup.string().email().required(),
  password: yup.string().required(),
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

          <Box component="form" onSubmit={handleSubmit(props.onLoginRequest)} noValidate sx={{ mt: 2 }}>
            {props.genericError ? <ErrorMessage message={props.genericError} /> : null}
            <TextField
              id="email"
              name="email"
              label="Email Address"
              required={true}
              fullWidth={true}
              inputProps={{...register("email", { required: true }), "data-test": "email-field"  }}
              error={!!errors.email}
              helperText={errors.email?.message ?? " "}
            />
            <PasswordField
              fieldId="password"
              labelTitle="Password"
              inputProps={{...register("password", { required: true }), "data-test": "password-field" }}
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
                <Button variant="text"
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