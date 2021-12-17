import { useState, useEffect, useContext } from "react";

import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import Loading from "../../components/Loading";
import UserNull from "../../components/UserNull";
import NotFound from "../../components/NotFound";
import ImageFileInput from "../../components/ImageFileInput";
import PrimaryLoader from "../../components/PrimaryLoader";

import UserContext from "../../context/UserContext";

import {
  getBlogCategoryByDocId,
  updateBlogCategoryByDocId,
  deleteBlogCategoryByDocId,
} from "../../firebase/services/firestoreServices";

import { objectDeepEqual } from "../../helpers/jsHelpers";

export default function ViewBlogCategory() {
  const { documentId } = useParams();

  const styles = useStyles();
  const history = useHistory();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [hasChanged, setHasChanged] = useState(false);

  const [originalObject, setOriginalObject] = useState({});
  const [newObject, setNewObject] = useState({
    name: "",
    description: "",
  });

  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);

  const refresh = async () => {
    setIsLoading(true);

    const result = await getBlogCategoryByDocId(documentId);
    if (result === null) {
      setNotFound(true);
    }

    setOriginalObject(result);
    setNewObject(result);
    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "View Blog Category";

    refresh();
  }, []);

  useEffect(() => {
    if (newObject?.title) {
      document.title = `${newObject?.title} Blog Category`;
    }

    if (
      objectDeepEqual(originalObject, newObject) &&
      thumbnailImageFile === null
    ) {
      setHasChanged(false);
    } else {
      setHasChanged(true);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [newObject, thumbnailImageFile]);

  const onDocumentFieldEdit = (fieldName, newValue) => {
    setNewObject({
      ...newObject,
      [fieldName]: newValue,
    });
  };

  const onDocumentDeleteSuccess = () => {
    history.goBack();
  };

  const onDocumentDeleteError = (error) => {
    setErrorMessage(error.message);
    setSuccessMessage("");
    alert(error.message);
  };

  const onDocumentDeleteClick = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the blog category: "${originalObject.title}"?`
      )
    ) {
      deleteBlogCategoryByDocId(originalObject.docId, {
        success: onDocumentDeleteSuccess,
        error: onDocumentDeleteError,
      });
    }
  };

  const onSaveChangesClick = async () => {
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

  const onEditProgress = (progressValue) => {
    setProgress(progressValue);
  };

  const onEditError = (error) => {
    setErrorMessage(error.message);
    setSuccessMessage("");
    setIsUploading(false);
    setProgress(0);
  };

  const edit = async () => {
    setIsUploading(true);
    setSuccessMessage("");

    const newDocumentObject = {
      ...newObject,
    };

    delete newDocumentObject.docId;

    await updateBlogCategoryByDocId(
      documentId,
      originalObject,
      newDocumentObject,
      {
        hasThumbnailChanged: thumbnailImageFile !== null,
        newThumbnailImageFile: thumbnailImageFile,
      },
      {
        success: onEditSuccess,
        progress: onEditProgress,
        error: onEditError,
      }
    );
  };

  if (user === null) {
    return <UserNull />;
  }

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  if (notFound) {
    return <NotFound />;
  }

  return (
    <Container className={styles.backgroundContainer}>
      <div className={styles.headingContainer}>
        <h1 className={styles.primaryHeading}>{newObject?.title}</h1>
        <IconButton
          variant="contained"
          color="secondary"
          onClick={() => onDocumentDeleteClick()}
        >
          <DeleteForeverIcon />
        </IconButton>
      </div>

      <TextField
        className={styles.primaryInput}
        label={"Title"}
        variant="outlined"
        fullWidth
        type="text"
        value={newObject.title}
        onChange={(event) => onDocumentFieldEdit("title", event.target.value)}
      />
      <TextField
        className={styles.primaryInput}
        label={"Description"}
        variant="outlined"
        fullWidth
        type="text"
        multiline
        rows={3}
        value={newObject.description}
        onChange={(event) =>
          onDocumentFieldEdit("description", event.target.value)
        }
      />

      <TextField
        className={styles.primaryInput}
        label="Slug"
        variant="outlined"
        fullWidth
        type="text"
        value={newObject.slug}
        disabled={true}
      />

      <ImageFileInput
        label="Thumbnail Image"
        setImageFile={setThumbnailImageFile}
        defaultImageURL={originalObject.thumbnailImage}
      />

      <TextField
        className={styles.primaryInput}
        label="Meta Description"
        variant="outlined"
        fullWidth
        type="text"
        multiline
        rows={3}
        value={newObject.metaDescription}
        onChange={(event) =>
          onDocumentFieldEdit("metaDescription", event.target.value)
        }
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
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
