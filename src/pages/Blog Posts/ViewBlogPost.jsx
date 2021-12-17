import { useState, useEffect, useContext } from "react";

import { useHistory, useParams, Prompt } from "react-router-dom";

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
import CustomToggle from "../../components/CustomToggle";
import BlogPostPreview from "../../components/Preview/BlogPostPreview";

import UserContext from "../../context/UserContext";

import {
  getBlogPostByDocId,
  getBlogCategoryByDocId,
  getBlogSubCategoryByDocId,
  deleteBlogPostByDocId,
  updateBlogPostByDocId,
  updateBlogPostMediaOnlyByDocId,
} from "../../firebase/services/firestoreServices";

import { objectDeepEqual } from "../../helpers/jsHelpers";

import CustomTinyMceEditor from "../../components/CustomTinyMceEditor";
import MediaUpload from "../../components/MediaUpload";
//import IndexGenerator from "../../components/IndexGenerator";
import ManualIndexGenerator from "../../components/ManualIndexGenerator";

import { nameError } from "../../constants/errors";

import { parseHtmlToGenerateIndexAndAnchorTags } from "../../helpers/jsHelpers";

import Selector from "../../components/Selector";
import CustomDatePicker from "../../components/CustomDatePicker";

export default function ViewBlogPost() {
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

  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);

  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);

  //const [index, setIndex] = useState([]);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);

  const [dateUpdated, setDateUpdated] = useState(new Date());

  const [previewObject, setPreviewObject] = useState(null);

  const refresh = async () => {
    setIsLoading(true);

    const result = await getBlogPostByDocId(documentId);
    if (result === null) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    const categoryResult = await getBlogCategoryByDocId(
      result.blogCategoryDocId
    );
    const subcategoryResult = await getBlogSubCategoryByDocId(
      result.blogSubcategoryDocId
    );

    setCategory(categoryResult);
    setSubcategory(subcategoryResult);

    const postObject = {
      ...result,
      dateUpdated: result.dateUpdated.toDate(),
      index: JSON.parse(result.index),
      media: JSON.parse(result.media),
    };

    setOriginalObject(postObject);
    setNewObject(postObject);
    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "View Blog Post";

    refresh();
  }, []);

  useEffect(() => {
    if (newObject?.title) {
      document.title = `${newObject?.title}`;
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

  useEffect(() => {
    onDocumentFieldEdit("dateUpdated", dateUpdated);
  }, [dateUpdated]);

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
        `Are you sure you want to delete the blog post: "${originalObject.title}"?`
      )
    ) {
      deleteBlogPostByDocId(originalObject.docId, {
        success: onDocumentDeleteSuccess,
        error: onDocumentDeleteError,
      });
    }
  };

  const onSaveChangesClick = async () => {
    if (window.confirm("Are you sure you want to save all the changes?")) {
      edit(!newObject.isDraft);
    }
  };

  const onDiscardChangesClick = () => {
    if (window.confirm("Are you sure you want to discard all the changes?")) {
      setNewObject(originalObject);
    }
  };

  const onSaveDraftClick = async () => {
    if (window.confirm("Are you sure you want to save all the changes?")) {
      edit(false);
    }
  };

  const onPublishClick = async () => {
    if (
      window.confirm(
        `Once published, the post will be available on the website.
Once published, the post cannot be set as a draft again. It can, however, be edited.
Are you sure you want to publish?`
      )
    ) {
      edit(true);
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

  const edit = async (isFinal) => {
    setIsUploading(true);
    setSuccessMessage("");

    const newDocumentObject = {
      ...newObject,
      isDraft: !isFinal,
      index: JSON.stringify(newObject.index),
      media: JSON.stringify(newObject.media),
    };

    delete newDocumentObject.docId;

    setNewObject({
      ...newObject,
      isDraft: !isFinal,
    });

    await updateBlogPostByDocId(
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

  const onMediaUpdateSuccess = () => {
    setSuccessMessage("Media updated successfully.");
  };

  const onMediaUpdateError = (error) => {
    setErrorMessage(error.message);
  };

  const updateMediaOnly = async (newMediaArray) => {
    await updateBlogPostMediaOnlyByDocId(
      documentId,
      JSON.stringify(newMediaArray),
      {
        success: onMediaUpdateSuccess,
        error: onMediaUpdateError,
      }
    );
  };

  const reloadPreviewButtonOnClick = () => {
    setPreviewObject({
      ...newObject,
      blogCategoryTitle: category.title,
      blogSubcategoryTitle: subcategory.title,
    });
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
      <Prompt
        //when={shouldBlockNavigation}
        message="You have unsaved changes, are you sure you want to leave?"
      />
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

      <div className={styles.subContainer}>
        <Typography className={styles.label} variant="h6" color="primary">
          Creator: {newObject.creatorName}
        </Typography>

        <CustomToggle
          label="Posting as anonymouns? "
          isSelected={newObject.postingAsAnonymous}
          setIsSelected={(newValue) =>
            onDocumentFieldEdit("postingAsAnonymous", newValue)
          }
        />
      </div>

      <Typography className={styles.label} variant="h6" color="primary">
        Category: {category.title}
      </Typography>

      <Typography className={styles.label} variant="h6" color="primary">
        Subcategory: {subcategory.title}
      </Typography>

      <TextField
        className={styles.primaryInput}
        label="Slug"
        variant="outlined"
        fullWidth
        type="text"
        value={newObject.slug}
        disabled={true}
      />

      <TextField
        className={styles.primaryInput}
        label={"Title"}
        variant="outlined"
        fullWidth
        type="text"
        value={newObject.title}
        onChange={(event) => onDocumentFieldEdit("title", event.target.value)}
      />

      <ImageFileInput
        label="Thumbnail Image"
        setImageFile={setThumbnailImageFile}
        defaultImageURL={originalObject.thumbnailImage}
      />

      <CustomDatePicker
        dateUpdated={newObject.dateUpdated}
        setDateUpdated={(newValue) =>
          onDocumentFieldEdit("dateUpdated", newValue)
        }
      />

      <TextField
        className={styles.primaryInput}
        label={"Summary"}
        variant="outlined"
        fullWidth
        type="text"
        multiline
        rows={3}
        value={newObject.summary}
        onChange={(event) => onDocumentFieldEdit("summary", event.target.value)}
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

      <ManualIndexGenerator
        index={newObject.index}
        setIndex={(newValue) => onDocumentFieldEdit("index", newValue)}
      />

      <CustomTinyMceEditor
        content={newObject.content}
        updateContent={(newContent) => {
          const editedContent = newContent.replace(
            "<img src",
            `<img style="max-width: 100%; max-height: 100%; object-fit: contain;" src`
          );
          onDocumentFieldEdit("content", editedContent);
        }}
      />

      <MediaUpload
        parentFolder={`media/blog/posts/${originalObject.docId}/uploaded-media`}
        media={newObject.media}
        setMedia={(newValue) => onDocumentFieldEdit("media", newValue)}
        onMediaChange={updateMediaOnly}
      />

      {isUploading ? (
        <div className={styles.loaderDisplayDiv}>
          <h4>Progress: {progress}%</h4>
          <PrimaryLoader loading={isUploading} />
        </div>
      ) : newObject?.isDraft ? (
        <div className={styles.primaryButtonsContainer}>
          <Button
            className={styles.primaryButton}
            type="submit"
            color="primary"
            variant="contained"
            fullWidth={true}
            onClick={() => onSaveDraftClick()}
          >
            Save Draft
          </Button>
          <Button
            className={styles.primaryButton}
            type="submit"
            color="primary"
            variant="contained"
            fullWidth={true}
            onClick={() => onPublishClick()}
          >
            Publish
          </Button>
        </div>
      ) : hasChanged ? (
        <div className={styles.primaryButtonsContainer}>
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
      <h1>Preview</h1>
      <Button
        className={styles.primaryButton}
        type="submit"
        color="primary"
        variant="contained"
        onClick={() => reloadPreviewButtonOnClick()}
      >
        Reload Preview
      </Button>
      {console.log("Data: ", newObject)}
      <BlogPostPreview data={previewObject} />
      <br />
      <br />
      <Typography color="secondary">{errorMessage}</Typography>
      <Typography color="primary">{successMessage}</Typography>
    </Container>
  );
}

const useStyles = makeStyles({
  label: {
    fontWeight: "bolder",
    margin: 15,
  },
  primaryInput: {
    marginBottom: 20,
  },
  primaryButtonsContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
  subContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
