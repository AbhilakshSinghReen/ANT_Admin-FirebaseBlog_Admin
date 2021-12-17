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
import CustomToggle from "../../components/CustomToggle";

import Selector from "../../components/Selector";

import UserContext from "../../context/UserContext";

import {
  getCollaboratorFromSuperAdminUid,
  getAllBlogSubCategoriesInBlogCategory,
} from "../../firebase/services/firestoreServices";

import { getAllTutorialCategories } from "../../firebase/services/Firestore Services/tutorialCategories";

import { getAllTutorialSubcategoriesInTutorialCategory } from "../../firebase/services/Firestore Services/tutorialSubcategories";

import { createNewTutorialSeries } from "../../firebase/services/Firestore Services/tutorialSeries";

import { nameError } from "../../constants/errors";

export default function CreateNewTutorialSeries() {
  const styles = useStyles();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [creator, setCreator] = useState(null);
  const [postingAsAnonymous, setPostingAsAnonymous] = useState(false);

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryDocId, setSelectedCategoryDocId] = useState("");

  const [allSubcategoriesInCategory, setAllSubcategoriesInCategory] = useState(
    []
  );
  const [selectedSubcategoryDocId, setSelectedSubcategoryDocId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);
  const [metaDescription, setMetaDescription] = useState("");

  const isValid =
    title !== "" && description !== "" && thumbnailImageFile !== null;

  const refresh = async () => {
    setIsLoading(true);

    const result = await getAllTutorialCategories();
    setAllCategories(result);

    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Create Tutorial Series";

    refresh();
  }, []);

  const getCreatorFromDb = async () => {
    if (user !== null && user.uid) {
      const result = await getCollaboratorFromSuperAdminUid(user.uid);
      setCreator(result);
      console.log(result);
    }
  };

  useEffect(() => {
    getCreatorFromDb();
  }, [user]);

  const getAllTutorialSubCategoriesInTutorialCategoryFromDb = async () => {
    const result = await getAllTutorialSubcategoriesInTutorialCategory(
      selectedCategoryDocId
    );
    setAllSubcategoriesInCategory(result);
  };

  useEffect(() => {
    getAllTutorialSubCategoriesInTutorialCategoryFromDb();
  }, [selectedCategoryDocId]);

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

    const tutorialCategorySlug = allCategories.find(
      (element) => element.docId === selectedCategoryDocId
    ).slug;

    const tutorialSubcategorySlug = allSubcategoriesInCategory.find(
      (element) => element.docId === selectedSubcategoryDocId
    ).slug;

    const newDocumentObject = {
      tutorialCategoryDocId: selectedCategoryDocId,
      tutorialCategorySlug: tutorialCategorySlug,
      tutorialSubcategoryDocId: selectedSubcategoryDocId,
      tutorialSubcategorySlug: tutorialSubcategorySlug,
      postingAsAnonymous: postingAsAnonymous,
      title: title,
      summary: description,
      thumbnailImageFile: thumbnailImageFile,
      slug: slug,
      metaDescription: metaDescription,
    };

    await createNewTutorialSeries(newDocumentObject, {
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
      <h1 className={styles.primaryHeading}>Create a new Tutorial Series</h1>

      <div className={styles.subContainer}>
        <Typography className={styles.label} variant="h6" color="primary">
          Creator: {creator?.name}
        </Typography>

        <CustomToggle
          label="Posting as anonymouns? "
          isSelected={postingAsAnonymous}
          setIsSelected={setPostingAsAnonymous}
        />
      </div>

      <div className={styles.subContainer}>
        <Typography color="secondary">
          Choose the category carefully as it cannot be changed later.
        </Typography>

        <Selector
          label="Category"
          selectedValue={selectedCategoryDocId}
          setSelectedValue={setSelectedCategoryDocId}
          allValues={allCategories}
        />
      </div>

      <div className={styles.subContainer}>
        <Typography color="secondary">
          Choose the subcategory carefully as it cannot be changed later.
        </Typography>

        <Selector
          label="Subcategory"
          selectedValue={selectedSubcategoryDocId}
          setSelectedValue={setSelectedSubcategoryDocId}
          allValues={allSubcategoriesInCategory}
        />
      </div>

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
          Create New Tutorial Series
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
  subContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
