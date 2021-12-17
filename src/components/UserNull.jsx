import { useHistory } from "react-router";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { notLoggedInError } from "../constants/errors";

import Slugs from "../constants/slugs";

export default function UserNull() {
  const styles = useStyles();
  const history = useHistory();

  return (
    <Container className={styles.backgroundContainer}>
      <Typography color="secondary">{notLoggedInError}</Typography>

      <br />
      <Button
        onClick={() => history.push(Slugs.login)}
        className={styles.authButton}
        color="primary"
        variant="contained"
        fullWidth={true}
      >
        Login
      </Button>

      <br />
    </Container>
  );
}

const useStyles = makeStyles({
  backgroundContainer: {
    paddingTop: 75,
    backgroundColor: "#ffffff",
    borderRadius: 25,
  },
});
