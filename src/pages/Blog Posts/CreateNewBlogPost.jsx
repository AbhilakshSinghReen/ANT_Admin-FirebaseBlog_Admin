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

import {
  getAllBlogCategories,
  getAllBlogSubCategoriesInBlogCategory,
  getCollaboratorFromSuperAdminUid,
  createNewBlogPost,
} from "../../firebase/services/firestoreServices";

import { nameError, slugError } from "../../constants/errors";

import { blogPostSlugs } from "../../constants/slugs";

export default function CreateNewBlogPost() {
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

  const [title, setTitle] = useState("");

  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);

  const [slug, setSlug] = useState("");

  const [creator, setCreator] = useState(null);
  const [postingAsAnonymous, setPostingAsAnonymous] = useState(false);

  const isValid =
    selectedCategoryDocId !== "" &&
    selectedSubcategoryDocId !== "" &&
    title !== "" &&
    slug !== "" &&
    creator !== null &&
    thumbnailImageFile !== null;

  const refresh = async () => {
    setIsLoading(true);

    const result = await getAllBlogCategories();
    setAllCategories(result);

    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Create Blog Post";

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

  const getAllBlogSubCategoriesInBlogCategoryFromDb = async () => {
    const result = await getAllBlogSubCategoriesInBlogCategory(
      selectedCategoryDocId
    );
    setAllSubcategoriesInCategory(result);
  };

  useEffect(() => {
    getAllBlogSubCategoriesInBlogCategoryFromDb();
  }, [selectedCategoryDocId]);

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

  const onCreateSuccess = (docRef) => {
    setIsUploading(false);
    setErrorMessage("");
    setSuccessMessage("Successfully added to the database.");
    setProgress(0);

    setTitle("");

    history.push(blogPostSlugs.viewDocument.replace(":documentId", docRef.id));
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
    //SAVE AS DRAFT -> Done in firestoreServices.createNewBlogPost

    setIsUploading(true);
    setSuccessMessage("");

    const blogCategorySlug = allCategories.find(
      (element) => element.docId === selectedCategoryDocId
    ).slug;

    const blogSubcategorySlug = allSubcategoriesInCategory.find(
      (element) => element.docId === selectedSubcategoryDocId
    ).slug;

    const newDocumentObject = {
      creatorDocId: creator.docId,
      creatorName: creator.name,

      postingAsAnonymous: postingAsAnonymous,

      blogCategoryDocId: selectedCategoryDocId,
      blogCategorySlug: blogCategorySlug,
      blogSubcategoryDocId: selectedSubcategoryDocId,
      blogSubcategorySlug: blogSubcategorySlug,

      title: title,
      slug: slug,

      content: "",
      summary: "",
      metaDescription: "",
      index: "[]",
      media: "[]",
      dateUpdated: new Date(),

      thumbnailImageFile: thumbnailImageFile,
    };

    await createNewBlogPost(newDocumentObject, {
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
      <h1 className={styles.primaryHeading}>Create a new Blog Post</h1>

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
