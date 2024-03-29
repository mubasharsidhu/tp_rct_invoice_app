import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { PasswordField } from "../../components/PasswordField/PasswordField";
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

const SignupSchema = yup.object({
  name           : yup.string().required("Name is a required field"),
  email          : yup.string().email("Email must be a valid email").required("Email is a required field"),
  password       : yup.string().required("Password is a required field"),
  confirmPassword: yup.string().required("You must confirm Password")
    .test('password', 'Password Must match', function (value) {
      return this.parent.password === value;
    }),
}).required();

export type SignupInputs = {
  name           : string,
  email          : string,
  password       : string,
  confirmPassword: string
};

export type SignupFormProps = {
  genericError?    : string;
  onNavigateToLogin: () => unknown
  onSignupRequest  : (data: SignupInputs) => unknown
}

export const SignupForm = (props: SignupFormProps) => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupInputs>({
    mode    : "onBlur",
    resolver: yupResolver(SignupSchema)
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
          <Typography component="h1" variant="h5">Sign up</Typography>

          <Box
            id="signup-form"
            component="form"
            noValidate
            sx={{ mt: 2 }}
            onSubmit={handleSubmit(props.onSignupRequest)}
          >
            {props.genericError ? <ErrorMessage message={props.genericError} /> : null}
            <TextField
              id="name"
              name="name"
              label="Name"
              required={true}
              fullWidth={true}
              margin="dense"
              inputProps={{...register("name", { required: true }) }}
              error={!!errors.name}
              helperText={errors.name?.message ?? " "}
            />
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
            <PasswordField
              fieldId="confirmPassword"
              labelTitle="confirmPassword"
              inputProps={{...register("confirmPassword", { required: true }) }}
              errorMessage={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              fullWidth={true}
              variant="contained"
            >Sign Up</Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                Already have an account?
                <Button variant="text" id="navigate-to-login-button"
                  onClick={(ev) => {
                    ev.preventDefault();
                    props.onNavigateToLogin();
                  }}
                >Sign in</Button>
              </Grid>
            </Grid>

          </Box>
        </Box>
      </Container>
    </>
  )

}