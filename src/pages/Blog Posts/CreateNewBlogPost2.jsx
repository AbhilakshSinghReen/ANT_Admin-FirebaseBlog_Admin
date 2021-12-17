import { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import UserNull from "../../components/UserNull";
import ImageFileInput from "../../components/ImageFileInput";
import PrimaryLoader from "../../components/PrimaryLoader";

import Selector from "../../components/Selector";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomToggle from "../../components/CustomToggle";

import UserContext from "../../context/UserContext";

import {
  getAllBlogCategories,
  getAllBlogSubCategoriesInBlogCategory,
  getCollaboratorFromSuperAdminUid,
  createNewBlogCategory,
} from "../../firebase/services/firestoreServices";

import CustomTinyMceEditor from "../../components/CustomTinyMceEditor";
import MediaUpload from "../../components/MediaUpload";
//import IndexGenerator from "../../components/IndexGenerator";
import ManualIndexGenerator from "../../components/ManualIndexGenerator";

import { nameError } from "../../constants/errors";

import { parseHtmlToGenerateIndexAndAnchorTags } from "../../helpers/jsHelpers";

export default function CreateNewBlogPost2() {
  const styles = useStyles();

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
  const [summary, setSummary] = useState("");

  const [creator, setCreator] = useState("");
  const [postAsAnonymous, setPostAsAnonymous] = useState("");

  const [dateUpdated, setDateUpdated] = useState(new Date());
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);

  const [index, setIndex] = useState([]);
  const [content, setContent] = useState("");


  const [media, setMedia] = useState([]);

  const isValid = title !== "" && summary !== "" && thumbnailImageFile !== null;

  

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

  const onCreateSuccess = (docRef) => {
    setIsUploading(false);
    setErrorMessage("");
    setSuccessMessage("Successfully added to the database.");
    setProgress(0);

    setTitle("");
    setSummary("");
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
    /*
    setIsUploading(true);
    setSuccessMessage("");

    const newDocumentObject = {
      title: title,
      description: description,
      thumbnailImageFile: thumbnailImageFile,
      slug: slug,
      metaDescription: metaDescription,
    };

    await createNewBlogCategory(newDocumentObject, {
      success: onCreateSuccess,
      progress: onCreateProgress,
      error: onCreateError,
    });
    */
  };

  const commitButtonOnClick = async () => {};

  if (user === null) {
    return <UserNull />;
  }

  return (
    <Container className={styles.backgroundContainer}>
      <h1 className={styles.primaryHeading}>Create a new Blog Post</h1>

      <Typography className={styles.label} variant="h6" color="primary">
        Creator: {creator?.name}
      </Typography>

      <CustomToggle
        label="Post as anonymouns? "
        isSelected={postAsAnonymous}
        setIsSelected={setPostAsAnonymous}
      />

      <hr className={styles.mainHr} />

      <Typography color="secondary">
        Choose the category carefully as it cannot be changed later.
      </Typography>

      <Selector
        label="Category"
        selectedValue={selectedCategoryDocId}
        setSelectedValue={setSelectedCategoryDocId}
        allValues={allCategories}
      />

      <hr className={styles.mainHr} />

      <Typography color="secondary">
        Choose the subcategory carefully as it cannot be changed later.
      </Typography>

      <Selector
        label="Subcategory"
        selectedValue={selectedSubcategoryDocId}
        setSelectedValue={setSelectedSubcategoryDocId}
        allValues={allSubcategoriesInCategory}
      />

      <hr className={styles.mainHr} />

      <TextField
        className={styles.primaryInput}
        label="Title"
        variant="outlined"
        fullWidth
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <Button
        className={styles.primaryButton}
        type="submit"
        color="primary"
        variant="contained"
        onClick={() => commitButtonOnClick()}
      >
        Commit
      </Button>

      <TextField
        className={styles.primaryInput}
        label="Summary"
        variant="outlined"
        fullWidth
        type="text"
        multiline
        rows={3}
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />

      <CustomDatePicker
        dateUpdated={dateUpdated}
        setDateUpdated={setDateUpdated}
      />

      <hr className={styles.mainHr} />
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
      <hr className={styles.mainHr} />

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

      <hr className={styles.mainHr} />

      <ManualIndexGenerator index={index} setIndex={setIndex} />

      {/*
      <Button
        className={styles.primaryButton}
        type="submit"
        color="primary"
        variant="contained"
        onClick={() => regenerateIndexButtonOnClick()}
      >
        Regenerate Index
      </Button>
      */}

      <CustomTinyMceEditor
        content={content}
        updateContent={(newContent) => {
          const editedContent = newContent.replace(
            "<img src",
            `<img style="max-width: 100%; max-height: 100%; object-fit: contain;" src`
          );
          setContent(editedContent);
        }}
      />

      <MediaUpload
        parentFolder={"mediaParentFolder"}
        media={media}
        setMedia={setMedia}
      />

      {isUploading ? (
        <div className={styles.loaderDisplayDiv}>
          <h4>Progress: {progress}%</h4>
          <PrimaryLoader loading={isUploading} />
        </div>
      ) : (
        <div className={styles.buttonsContainer}>
          <Button
            className={styles.primaryButton}
            type="submit"
            color="primary"
            variant="contained"
            disabled={!isValid}
            fullWidth={true}
            onClick={create}
          >
            Create New Blog Post
          </Button>
          <Button
            className={styles.primaryButton}
            type="submit"
            color="primary"
            variant="contained"
            disabled={!isValid}
            //fullWidth={true}
            //onClick={create}
          >
            Save Draft
          </Button>
          <Button
            className={styles.primaryButton}
            type="submit"
            color="primary"
            variant="contained"
            disabled={!isValid}
            //fullWidth={true}
            //onClick={create}
          >
            Live Preview
          </Button>
        </div>
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
    margin: 15,
  },
  mainHr: {
    width: "100%",
    height: 1,
  },
});
