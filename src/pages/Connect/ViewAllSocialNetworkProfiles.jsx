import { useState, useEffect, useContext } from "react";

import UserContext from "../../context/UserContext";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { useHistory } from "react-router-dom";

import AddIcon from "@material-ui/icons/Add";

import {
  getAllRootSocialNetworkProfiles,
  deleteRootSocialNetworkProfile,
} from "../../firebase/services/firestoreServices";

import SocialNetworkProfileDisplayer from "../../components/SocialNetworkProfileDisplayer";

import Loading from "../../components/Loading";
import UserNull from "../../components/UserNull";

import { connectSlugs as collectionSlugs } from "../../constants/slugs";

export default function ViewAllSocialNetworkProfiles() {
  const styles = useStyles();
  const history = useHistory();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [allDocuments, setAllDocuments] = useState([]);

  const refresh = async () => {
    setIsLoading(true);

    const result = await getAllRootSocialNetworkProfiles();
    setAllDocuments(result);

    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Social Network Profiles";

    refresh();
  }, []);

  const onDocumentDeleteSuccess = () => {
    refresh();
    setErrorMessage("");
    setSuccessMessage("Deleted successfully");
    alert("Deleted successfully");
  };

  const onDocumentDeleteError = (error) => {
    setErrorMessage(error.message);
    setSuccessMessage("");
    alert(error.message);
  };

  const onDocumentDeleteClick = async (targetDocument) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${targetDocument.networkName}" profile?`
      )
    ) {
      deleteRootSocialNetworkProfile(targetDocument, {
        success: onDocumentDeleteSuccess,
        error: onDocumentDeleteError,
      });
    }
  };

  if (user === null) {
    return <UserNull />;
  }

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <Container className={styles.backgroundContainer}>
      <div className={styles.viewCollectionHeaderDiv}>
        <h1 className={styles.documentAdderHeading}>
          All Social Network Profiles
        </h1>
        <IconButton
          variant="contained"
          color="primary"
          onClick={() => history.push(collectionSlugs.createDocument)}
        >
          <AddIcon />
        </IconButton>
      </div>
      <br />
      <Typography color="secondary">{errorMessage}</Typography>
      <Typography color="primary">{successMessage}</Typography>
      <br />

      {allDocuments.map((document, index) => (
        <SocialNetworkProfileDisplayer
          socialNetworkProfile={document}
          onDelete={() => onDocumentDeleteClick(document)}
          key={index}
        />
      ))}
    </Container>
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
  loaderDisplayDiv: {
    paddingTop: 25,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
