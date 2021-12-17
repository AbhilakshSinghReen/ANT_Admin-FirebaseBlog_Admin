import { useContext } from "react";
import UserContext from "../context/UserContext";

import { useHistory, Redirect } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core";

import { signOutUser } from "../firebase/services/firebaseAuthServices";

export default function DoubleAuthAttempt() {
  const history = useHistory();
  const styles = useStyles();

  const { user } = useContext(UserContext);

  const logout = async () => {
    await signOutUser();
    history.push("/login");
  };

  const goToDashboard = () => {
    history.push("/");
  };

  if (user === null) {
    <Redirect to="/login" />;
  }

  return (
    <Box display="flex" flexDirection="column">
      <Container className={styles.backgroundContainer}>
        <Typography className={styles.secondaryText} align="center">
          Oops. It looks like you are already logged in.
        </Typography>
        <Button
          className={styles.primaryButton}
          color="primary"
          variant="contained"
          fullWidth={true}
          onClick={() => logout()}
        >
          Logout
        </Button>
        <Button
          className={styles.primaryButton}
          color="primary"
          variant="contained"
          fullWidth={true}
          onClick={() => goToDashboard()}
        >
          Go to Dashboard
        </Button>
      </Container>
    </Box>
  );
}

const useStyles = makeStyles({
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
  secondaryText: {
    marginBottom: 20,
  },
});
