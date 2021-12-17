import { useState, useEffect, useContext } from "react";

import { useHistory } from "react-router";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import UserNull from "../../components/UserNull";
import Loading from "../../components/Loading";
import PrimaryLoader from "../../components/PrimaryLoader";

import Selector from "../../components/Selector";
import CustomToggle from "../../components/CustomToggle";
import ImageFileInput from "../../components/ImageFileInput";

import UserContext from "../../context/UserContext";

import { getCollaboratorFromSuperAdminUid } from "../../firebase/services/firestoreServices";
import { getAllTutorialCategories } from "../../firebase/services/Firestore Services/tutorialCategories";
import { getAllTutorialSubcategoriesInTutorialCategory } from "../../firebase/services/Firestore Services/tutorialSubcategories";
import { getAllTutorialSeriesInTutorialSubcategory } from "../../firebase/services/Firestore Services/tutorialSeries";
import { createNewTutorial } from "../../firebase/services/Firestore Services/tutorialTutorials";

import { nameError, slugError } from "../../constants/errors";

import { tutorialsTutorialsSlugs } from "../../constants/slugs";

//import { isStringNonNegativeInteger } from "../../helpers/jsHelpers";

export default function CreateNewTutorial() {
  const styles = useStyles();
  const history = useHistory();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryDocId, setSelectedCategoryDocId] = useState("");

  const [allSubcategoriesInCategory, setAllSubcategoriesInCategory] = useState(
    []
  );
  const [selectedSubcategoryDocId, setSelectedSubcategoryDocId] = useState("");

  const [allSeriesInSubcategory, setAllSeriesInSubcategory] = useState([]);
  const [selectedSeriesDocId, setSelectedSeriesDocId] = useState("");

  const [title, setTitle] = useState("");

  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);

  const [slug, setSlug] = useState("");

  const [creator, setCreator] = useState(null);
  const [postingAsAnonymous, setPostingAsAnonymous] = useState(false);

  const [tutorialPartInSeries, setTutorialPartInSeries] = useState(0);
  const [tutorialSubPartInSeries, setTutorialSubPartInSeries] = useState("");

  // --- VALUE CHECKING FUNCTIONS ---

  const tutorialPartInSeriesOnChange = (newValue) => {
    setTutorialPartInSeries(newValue);
    /*
    if (isStringNonNegativeInteger(newValue)) {
      setTutorialPartInSeries(newValue);
    } else {
      alert("Part must be a non-negative integer.");
    }
    */
  };

  const tutorialSubPartInSeriesOnChange = (newValue) => {
    setTutorialSubPartInSeries(newValue);
  };

  const isValid =
    selectedCategoryDocId !== "" &&
    selectedSubcategoryDocId !== "" &&
    selectedSeriesDocId !== "" &&
    title !== "" &&
    tutorialPartInSeries !== "" &&
    slug !== "" &&
    creator !== null &&
    thumbnailImageFile !== null;

  /// ---FUNCTIONS

  const refresh = async () => {
    setIsLoading(true);

    const allTutorialCategoriesResult = await getAllTutorialCategories();
    setAllCategories(allTutorialCategoriesResult);

    setIsLoading(false);
  };

  const getCreatorFromDb = async () => {
    if (user !== null && user.uid) {
      const result = await getCollaboratorFromSuperAdminUid(user.uid);
      setCreator(result);
      console.log(result);
    }
  };

  const getAllTutorialSubcategoriesInTutorialCategoryFromDb = async () => {
    const result = await getAllTutorialSubcategoriesInTutorialCategory(
      selectedCategoryDocId
    );
    setAllSubcategoriesInCategory(result);
  };

  const getAllTutorialSeriesInTutorialSubcategoryFromDb = async () => {
    const result = await getAllTutorialSeriesInTutorialSubcategory(
      selectedSubcategoryDocId
    );
    setAllSeriesInSubcategory(result);
  };

  const onCreateSuccess = (docRef) => {
    setIsUploading(false);
    setErrorMessage("");
    setSuccessMessage("Successfully added to the database.");
    setProgress(0);

    setTitle("");

    history.push(
      tutorialsTutorialsSlugs.viewDocument.replace(":documentId", docRef.id)
    );
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
    //SAVE AS DRAFT AND APPROVED -> Done in firestoreServices.createNewBlogPost

    setIsUploading(true);
    setSuccessMessage("");

    const tutorialCategorySlug = allCategories.find(
      (element) => element.docId === selectedCategoryDocId
    ).slug;

    const tutorialSubcategorySlug = allSubcategoriesInCategory.find(
      (element) => element.docId === selectedSubcategoryDocId
    ).slug;

    const tutorialSeriesSlug = allSeriesInSubcategory.find(
      (element) => element.docId === selectedSeriesDocId
    ).slug;

    const newDocumentObject = {
      creatorDocId: creator.docId,
      //creatorName is not required here and neither in blog posts
      //creatorName: creator.name,

      postingAsAnonymous: postingAsAnonymous,

      tutorialCategoryDocId: selectedCategoryDocId,
      tutorialCategorySlug: tutorialCategorySlug,
      tutorialSubcategoryDocId: selectedSubcategoryDocId,
      tutorialSubcategorySlug: tutorialSubcategorySlug,
      tutorialSeriesDocId: selectedSeriesDocId,
      tutorialSeriesSlug: tutorialSeriesSlug,

      title: title,
      slug: slug,
      partInSeries:tutorialPartInSeries,
      subPartInSeries:tutorialSubPartInSeries,

      content: "",
      summary: "",
      metaDescription: "",
      index: "[]",
      media: "[]",
      dateUpdated: new Date(),

      thumbnailImageFile: thumbnailImageFile,
    };

    await createNewTutorial(newDocumentObject, {
      success: onCreateSuccess,
      progress: onCreateProgress,
      error: onCreateError,
    });
  };

  /// ---EFFECTS

  useEffect(() => {
    document.title = "Create Tutorial";

    refresh();
  }, []);

  useEffect(() => {
    getCreatorFromDb();
  }, [user]);

  useEffect(() => {
    getAllTutorialSubcategoriesInTutorialCategoryFromDb();
  }, [selectedCategoryDocId]);

  useEffect(() => {
    getAllTutorialSeriesInTutorialSubcategoryFromDb();
  }, [selectedSubcategoryDocId]);

  useEffect(() => {
    if (errorMessage === nameError) {
      setErrorMessage("");
    }
  }, [title]);

  useEffect(() => {
    if (errorMessage === slugError) {
      setErrorMessage("");
    }
  }, [slug]);

  // --- Exceptions ---
  if (user === null) {
    return <UserNull />;
  }

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  // --- Main JSX ---
  return (
    <Container className={styles.backgroundContainer}>
      <h1 className={styles.primaryHeading}>Create a new Tutorial</h1>

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

      <div className={styles.subContainer}>
        <Typography color="secondary">
          Choose the series carefully as it cannot be changed later.
        </Typography>

        <Selector
          label="Series"
          selectedValue={selectedSeriesDocId}
          setSelectedValue={setSelectedSeriesDocId}
          allValues={allSeriesInSubcategory}
        />
      </div>

      <div className={styles.subContainer}>
        <TextField
          className={styles.primaryInput}
          label="Tutorial part in series"
          variant="outlined"
          fullWidth
          type="text"
          value={tutorialPartInSeries}
          onChange={(event) => tutorialPartInSeriesOnChange(event.target.value)}
        />
        <TextField
          className={styles.primaryInput}
          label="Tutorial sub part in series"
          variant="outlined"
          fullWidth
          type="text"
          value={tutorialSubPartInSeries}
          onChange={(event) =>
            tutorialSubPartInSeriesOnChange(event.target.value)
          }
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

      <ImageFileInput
        label="Thumbnail Image"
        setImageFile={setThumbnailImageFile}
        //defaultImageURL={originalObject.thumbnailImage}
      />

      <div className={styles.subContainer}>
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
      </div>

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
          Continue
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
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
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
  label: {
    width: "50%",
    fontWeight: "bolder",
    marginRight: 15,
  },
  mainHr: {
    width: "100%",
    height: 1,
  },
  subContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
