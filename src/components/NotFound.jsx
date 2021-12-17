import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

export default function NotFound({ loading }) {
  const styles = useStyles();

  return (
    <Container className={styles.backgroundContainer}>
      <Typography variant="h1" component="h1" color="secondary">
        Not Found
      </Typography>
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
