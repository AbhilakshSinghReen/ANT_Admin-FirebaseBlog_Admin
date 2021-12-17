import { makeStyles } from "@material-ui/core/styles";

export default function ConnectRenderer() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Have doubts?</h2>
      <a href={"https://www.aniceteacher.com/connect/"} target="_blank">
        <h2 className={styles.linkText}>Contact.</h2>
      </a>
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    marginTop: 0,
    marginBottom: 0,
  },
  heading: {
    marginTop: 0,
    marginBottom: 0,
  },
  linkText: {
    marginLeft: 15,
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
});
