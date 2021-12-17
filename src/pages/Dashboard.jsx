import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";

import { useHistory, Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { auth } from "../firebase/firebase";
import PropagateLoader from "react-spinners/PropagateLoader";

import { signInUserWithEmailAndPassword } from "../firebase/services/firebaseAuthServices";

import { appName } from "../constants/appDetails";

export default function Dashboard() {
  const styles = useStyles();
  const history = useHistory();

  const { user } = useContext(UserContext);
  const [userLoggingIn, setUserLoggingIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isUserLoggingIn, setIsUserLoggingIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const isValid = email !== "" && password !== "";

  useEffect(() => {
    document.title = "A.N.T. Super Admin Dashboard";
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Container className={styles.authContainer}>
        <Typography className={styles.mainHeading} variant="h3">
          {appName}
        </Typography>
        <Typography className={styles.authHeading} variant="h5">
          Dashboard
        </Typography>

        {error ? (
          <>
            {" "}
            <Typography align="center" color="secondary">
              {error}
            </Typography>{" "}
            <br />{" "}
          </>
        ) : null}
        <PropagateLoader loading={loading} size={15} color="#3f51b5" />
      </Container>
    </Box>
  );
}

const useStyles = makeStyles({
  input: {
    marginBottom: 20,
  },
  authButton: {
    marginBottom: 20,
  },
  authContainer: {
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
  mainHeading: {
    marginBottom: 15,
    borderBottom: "1px solid lightgray",
    textAlign: "center",
  },
  authHeading: {
    marginBottom: 50,
    borderBottom: "1px solid lightgray",
    textAlign: "center",
  },
});
