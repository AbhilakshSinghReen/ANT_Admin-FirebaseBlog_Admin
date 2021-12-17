import { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import UserNull from "../components/UserNull";
import Loading from "../components/Loading";
import PrimaryLoader from "../components/PrimaryLoader";

import CustomDatePicker from "../components/CustomDatePicker";
import CustomTinyMceEditor from "../components/CustomTinyMceEditor";

import UserContext from "../context/UserContext";

import {
  getTermsAndConditions,
  updateTermsAndConditions,
} from "../firebase/services/firestoreServices";

import { objectDeepEqual } from "../helpers/jsHelpers";

export default function TermsAndConditions() {
  const styles = useStyles();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [hasChanged, setHasChanged] = useState(false);

  const [originalObject, setOriginalObject] = useState({});
  const [newObject, setNewObject] = useState({
    dateUpdated: new Date(),
    content: "",
  });

  const refresh = async () => {
    setIsLoading(true);

    const result = await getTermsAndConditions();

    setOriginalObject(result);
    setNewObject(result);
    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Terms And Conditions";

    refresh();
  }, []);

  useEffect(() => {
    if (objectDeepEqual(originalObject, newObject)) {
      setHasChanged(false);
    } else {
      setHasChanged(true);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [newObject]);

  const onEditorContentUpdated = (newContent) => {
    const editedContent = newContent.replace(
      "<img src",
      `<img style="max-width: 100%; max-height: 100%; object-fit: contain;" src`
    );
    setNewObject({
      ...newObject,
      content: editedContent,
    });
  };

  const onSaveChangesClick = () => {
    if (window.confirm("Are you sure you want to save all the changes?")) {
      edit();
    }
  };

  const onDiscardChangesClick = () => {
    if (window.confirm("Are you sure you want to discard all the changes?")) {
      setNewObject(originalObject);
    }
  };

  const onEditSuccess = (docRef) => {
    setOriginalObject(newObject);
    setHasChanged(false);

    setErrorMessage("");
    setSuccessMessage("Changes saved.");
    setIsUploading(false);
    setProgress(0);
  };

  const onEditError = (error) => {
    setErrorMessage(error.message);
    setSuccessMessage("");
    setIsUploading(false);
    setProgress(0);
  };

  const edit = async () => {
    await updateTermsAndConditions(newObject, {
      success: onEditSuccess,
      error: onEditError,
    });
  };

  if (user === null) {
    return <UserNull />;
  }

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <Container className={styles.backgroundContainer}>
      <h1 className={styles.primaryHeading}>Terms And Conditions</h1>

      <CustomDatePicker
        dateUpdated={newObject.dateUpdated}
        setDateUpdated={(newValue) => {
          setNewObject({
            ...newObject,
            dateUpdated: newValue,
          });
        }}
      />

      <CustomTinyMceEditor
        content={newObject.content}
        updateContent={onEditorContentUpdated}
      />

      {isUploading ? (
        <div className={styles.loaderDisplayDiv}>
          <h4>Progress: {progress}%</h4>
          <PrimaryLoader loading={isUploading} />
        </div>
      ) : hasChanged ? (
        <div>
          <Button
            className={styles.primaryButton}
            type="submit"
            color="primary"
            variant="contained"
            fullWidth={true}
            onClick={() => onSaveChangesClick()}
          >
            Save Changes
          </Button>
          <Button
            className={styles.primaryButton}
            type="submit"
            color="secondary"
            variant="contained"
            fullWidth={true}
            onClick={() => onDiscardChangesClick()}
          >
            Discard Changes
          </Button>
        </div>
      ) : null}

      <br />
      <br />
      <Typography color="secondary">{errorMessage}</Typography>
      <Typography color="primary">{successMessage}</Typography>
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
