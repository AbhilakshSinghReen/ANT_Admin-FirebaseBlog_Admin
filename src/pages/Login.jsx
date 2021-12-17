import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";

import { useHistory, Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import PropagateLoader from "react-spinners/PropagateLoader";

import { signInUserWithEmailAndPassword } from "../firebase/services/firebaseAuthServices";

import { appName } from "../constants/appDetails";

export default function Login() {
  const styles = useStyles();
  const history = useHistory();

  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [isUserLoggingIn, setIsUserLoggingIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const isValid = email !== "" && password !== "";

  useEffect(() => {
    document.title = "Login";
  }, []);

  const onLoginSuccess = (authUser) => {
    //console.log("Logged in successfully.");
    setLoading(false);
    history.push("/");
  };

  const onLoginError = (error) => {
    //console.log(error.message);
    setError(error.message);
  };

  const login = async () => {
    setLoading(true);
    signInUserWithEmailAndPassword(email, password, {
      success: onLoginSuccess,
      error: onLoginError,
    });
  };

  if (user && !isUserLoggingIn) {
    return (
      <Box display="flex" flexDirection="column">
        <Redirect to="/double-auth-attempt" />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      <Container className={styles.backgroundContainer}>
        <Typography className={styles.primaryHeading} variant="h3">
          {appName}
        </Typography>
        <Typography className={styles.secondaryHeading} variant="h5">
          Login
        </Typography>
        <TextField
          className={styles.primaryInput}
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className={styles.primaryInput}
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={() => login()}
          className={styles.primaryButton}
          color="primary"
          variant="contained"
          disabled={!isValid}
          fullWidth={true}
          classes={{ disabled: styles.disabledAuthButton }}
        >
          Login
        </Button>
        <Typography align="center" color="secondary">
          {error}
        </Typography>{" "}
        <br />
        <PropagateLoader loading={loading} size={15} color="#3f51b5" />
      </Container>
    </Box>
  );
}

const useStyles = makeStyles({
  primaryInput: {
    marginBottom: 20,
  },
  primaryButton: {
    marginBottom: 20,
  },
  backgroundContainer: {
    backgroundColor: "#ffffff",
    marginTop: 25,
    padding: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid lightgray",
    width: 600,
  },
  primaryHeading: {
    marginBottom: 15,
    borderBottom: "1px solid lightgray",
    textAlign: "center",
  },
  secondaryHeading: {
    marginBottom: 50,
    borderBottom: "1px solid lightgray",
    textAlign: "center",
  },
});
