//import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";

export default function ContentsRenderer({ contents }) {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Contents</h1>
      {contents.map((item, index) => (
        <a href={item.anchorName} key={index}>
          <p
            className={styles.linkText}
            style={{
              fontSize: 18 - 1.5 * item.level,
              fontWeight: "500",
              marginBottom: 2 * item.level,
              marginTop: 0,
              marginLeft: 5 * item.level,
            }}
          >
            {item.title}
          </p>
        </a>
      ))}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  heading: {
    textDecoration: "underline",
  },
  linkText: {
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
}));
