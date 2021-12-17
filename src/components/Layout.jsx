import { makeStyles } from "@material-ui/core";

import Navbars from "./Navbars";

export default function Layout({ children }) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Navbars />
      <br />
      <div className={styles.page}>{children}</div>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  page: {
    background: "#F9F9F9",
    width: "100%",
  },
});
