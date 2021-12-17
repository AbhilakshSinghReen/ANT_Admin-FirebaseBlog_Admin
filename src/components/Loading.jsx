import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";

//import PrimarySpinner from "./PrimarySpinner";
import PrimaryLoader from "./PrimaryLoader";

export default function Loading({ loading }) {
  const styles = useStyles();
  return (
    <Container className={styles.loadingBackgroundContainer}>
      <PrimaryLoader loading={loading} />
    </Container>
  );
}

const useStyles = makeStyles({
  loadingBackgroundContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "#ffffff",
    borderRadius: 25,
  },
});
