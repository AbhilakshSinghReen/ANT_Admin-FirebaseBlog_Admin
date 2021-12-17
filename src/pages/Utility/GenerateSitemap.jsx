import { useState, useEffect, useContext } from "react";

import UserContext from "../../context/UserContext";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import UserNull from "../../components/UserNull";
import PrimaryLoader from "../../components/PrimaryLoader";

import { generateSitemap } from "../../firebase/services/firestoreServices";

export default function GenerateSitemap() {
  const styles = useStyles();

  const { user } = useContext(UserContext);

  const [isWorking, setIsWorking] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [sitemapFileURL, setSitemapFileURL] = useState("");
  const [buttonLabelText, setButtonLabelText] = useState("Generate Sitemap");

  useEffect(() => {
    document.title = "Generate Sitemap";
  }, []);

  const generateSitemapOnSuccess = (sitemapXml) => {
    setIsWorking(false);
    setButtonLabelText("Generate Sitemap Again");
    
    const blob = new Blob([sitemapXml], {
      type: "application/xml",
    });
    setSitemapFileURL(URL.createObjectURL(blob));
  };

  const generateSitemapOnError = (error) => {
    setIsWorking(false);
    console.log(error);
    setErrorMessage(error.message);
  };

  const generateSitemapButtonOnClick = () => {
    setIsWorking(true);

    generateSitemap({
      success: generateSitemapOnSuccess,
      error: generateSitemapOnError,
    });
  };

  if (user === null) {
    return <UserNull />;
  }

  return (
    <Container className={styles.backgroundContainer}>
      <div className={styles.viewCollectionHeaderDiv}>
        <h1 className={styles.documentAdderHeading}>Generate Sitemap</h1>
      </div>
      <br />
      <Typography color="secondary">{errorMessage}</Typography>
      <Typography color="primary">{successMessage}</Typography>
      <br />

      {isWorking ? (
        <div className={styles.loaderDisplayDiv}>
          <PrimaryLoader loading={isWorking} />
        </div>
      ) : (
        <Button
          color="primary"
          variant="contained"
          fullWidth={true}
          onClick={() => generateSitemapButtonOnClick()}
        >
          {buttonLabelText}
        </Button>
      )}

      <br />
      {sitemapFileURL ? (
        <Typography>
          Sitemap generated{" "}
          <a href={sitemapFileURL} download="sitemap.xml">
            Click to download
          </a>
        </Typography>
      ) : null}
    </Container>
  );
}

const useStyles = makeStyles({
  backgroundContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingTop: 75,
    paddingBottom: 75,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  viewCollectionHeaderDiv: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  loaderDisplayDiv: {
    paddingTop: 25,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
