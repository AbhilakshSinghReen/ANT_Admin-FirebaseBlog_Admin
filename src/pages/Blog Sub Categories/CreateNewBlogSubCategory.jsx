import { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import UserNull from "../../components/UserNull";
import Loading from "../../components/Loading";
import ImageFileInput from "../../components/ImageFileInput";
import PrimaryLoader from "../../components/PrimaryLoader";

import Selector from "../../components/Selector";

import UserContext from "../../context/UserContext";

import {
  getAllBlogCategories,
  createNewBlogSubCategory,
  createNewBlogCategory,
} from "../../firebase/services/firestoreServices";

import { nameError } from "../../constants/errors";

export default function CreateNewBlogSubCategory() {
  const styles = useStyles();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryDocId, setSelectedCategoryDocId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);
  const [metaDescription, setMetaDescription] = useState("");

  const isValid =
    title !== "" && description !== "" && thumbnailImageFile !== null;

  const refresh = async () => {
    setIsLoading(true);

    const result = await getAllBlogCategories();
    setAllCategories(result);

    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Create Blog Subcategory";

    refresh();
  }, []);

  useEffect(() => {
    if (errorMessage === nameError) {
      setErrorMessage("");
    }
  }, [title]);

  const onCreateSuccess = (docRef) => {
    setIsUploading(false);
    setErrorMessage("");
    setSuccessMessage("Successfully added to the database.");
    setProgress(0);

    setTitle("");
    setDescription("");
    setSlug("");
    setMetaDescription("");
    setThumbnailImageFile(null);
  };

  const onCreateProgress = (progressValue) => {
    setProgress(progressValue);
  };

  const onCreateError = (error) => {
    setIsUploading(false);
    setErrorMessage(error.message);
    setSuccessMessage("");
    setProgress(0);
  };

  const create = async () => {
    setIsUploading(true);
    setSuccessMessage("");

    const blogCategorySlug = allCategories.find(
      (element) => element.docId === selectedCategoryDocId
    ).slug;

    const newDocumentObject = {
      blogCategoryDocId: selectedCategoryDocId,
      blogCategorySlug: blogCategorySlug,
      title: title,
      description: description,
      thumbnailImageFile: thumbnailImageFile,
      slug: slug,
      metaDescription: metaDescription,
    };

    await createNewBlogSubCategory(newDocumentObject, {
      success: onCreateSuccess,
      progress: onCreateProgress,
      error: onCreateError,
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
      <h1 className={styles.primaryHeading}>Create a new Blog Subcategory</h1>

      <Typography color="secondary">
        Choose the category carefully as it cannot be changed later.
      </Typography>

      <Selector
        label="Category"
        selectedValue={selectedCategoryDocId}
        setSelectedValue={setSelectedCategoryDocId}
        allValues={allCategories}
      />

      <TextField
        className={styles.primaryInput}
        label="Title"
        variant="outlined"
        fullWidth
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <TextField
        className={styles.primaryInput}
        label="Description"
        variant="outlined"
        fullWidth
        type="text"
        multiline
        rows={3}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <Typography color="secondary">
        Choose the slug carefully as it cannot be changed later.
      </Typography>

      <TextField
        className={styles.primaryInput}
        label="Slug"
        variant="outlined"
        fullWidth
        type="text"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
      />

      <ImageFileInput
        label="Thumbnail Image"
        setImageFile={setThumbnailImageFile}
      />

      <TextField
        className={styles.primaryInput}
        label="Meta Description"
        variant="outlined"
        fullWidth
        type="text"
        multiline
        rows={3}
        value={metaDescription}
        onChange={(event) => setMetaDescription(event.target.value)}
      />

      {isUploading ? (
        <div className={styles.loaderDisplayDiv}>
          <h4>Progress: {progress}%</h4>
          <PrimaryLoader loading={isUploading} />
        </div>
      ) : (
        <Button
          className={styles.primaryButton}
          type="submit"
          color="primary"
          variant="contained"
          disabled={!isValid}
          fullWidth={true}
          onClick={create}
        >
          Create New Blog Subcategory
        </Button>
      )}
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
