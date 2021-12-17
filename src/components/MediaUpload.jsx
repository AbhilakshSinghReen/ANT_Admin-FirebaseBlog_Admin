import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import ClipLoader from "react-spinners/ClipLoader";

import { acceptedSiteMediaFileTypes } from "../constants/fileTypes";
import { mediaUploadErrors } from "../constants/errors";

import {
  uploadToStorage,
  deleteFromStorage,
} from "../firebase/services/firebaseStorageServices";

export default function MediaUpload({
  parentFolder,
  media,
  setMedia,
  onMediaChange,
}) {
  const styles = useStyles();

  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaFileOriginal, setNewMediaFileOriginal] = useState(null);
  const [newMediaFile, setNewMediaFile] = useState("");
  const [newMediaAlt, setNewMediaAlt] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const acceptedMediaFileTypes = acceptedSiteMediaFileTypes;

  const newMediaValid =
    newMediaTitle !== "" && newMediaFile !== "" && newMediaAlt !== "";

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {}, [media]);

  const resetError = (oldError) => {
    if (error === oldError) {
      setError("");
    }
  };

  const handleSelectedFileChange = (event) => {
    if (event.target.files[0]) {
      if (
        acceptedMediaFileTypes.includes(
          event.target.files[0].name?.split(".").pop()
        )
      ) {
        setNewMediaFile(URL.createObjectURL(event.target.files[0]));
        setNewMediaFileOriginal(event.target.files[0]);
        setNewMediaTitle(event.target.files[0].name);
        resetError(mediaUploadErrors.invalidFileType);
      } else {
        event.target.value = null;
        setError(mediaUploadErrors.invalidFileType);
        setNewMediaTitle("");
        setNewMediaFile("");
        setNewMediaFileOriginal(null);
      }
    }
  };

  const generateImageHTML = (url, alt) => {
    return `<img src="${url}" alt="${alt}" />`;
  };

  const onNewMediaUploadSuccess = (url) => {
    if (url !== "") {
      const newMedia = {
        title: newMediaTitle,
        url: url,
        alt: newMediaAlt,
      };
      const updatedMediaList = [...media];
      updatedMediaList.push(newMedia);
      onMediaChange(updatedMediaList);
      setMedia(updatedMediaList);
    }
    setNewMediaTitle("");
    setNewMediaAlt("");
    setNewMediaFile("");
    setNewMediaFileOriginal(null);

    setIsUploading(false);
  };

  const onNewMediaUploadProgress = (progressValue) => {
    setProgress(progressValue);
  };

  const onNewMediaUploadError = (error) => {
    setError(error);

    setIsUploading(false);
  };

  const addButtonOnClick = async () => {
    if (newMediaTitle && newMediaFileOriginal) {
      setIsUploading(true);
      await uploadToStorage(parentFolder, newMediaTitle, newMediaFileOriginal, {
        success: onNewMediaUploadSuccess,
        progress: onNewMediaUploadProgress,
        error: onNewMediaUploadError,
      });
      resetError(mediaUploadErrors.noFileChosen);
    } else {
      setError(mediaUploadErrors.noFileChosen);
    }
  };

  const copyHtmlButtonOnClick = (url, altText) => {
    navigator.clipboard.writeText(generateImageHTML(url, altText));
  };

  const copyUrlButtonOnClick = (url) => {
    navigator.clipboard.writeText(url);
  };

  const copyAltTextButtonOnClick = (altText) => {
    navigator.clipboard.writeText(altText);
  };

  const onMediaDeleteSuccess = (mediaTitle) => {
    setError("");

    const newMedia = media.filter(
      (someMedia) => someMedia.title !== mediaTitle
    );
    onMediaChange(newMedia);
    setMedia(newMedia);
  };

  const onDeleteMediaError = (error) => {
    setError(error);
  };

  const deleteButtonOnClick = async (mediaTitle) => {
    if (
      window.confirm(
        `This media object will be deleted permanently. You cannot undo this.`
      )
    ) {
      await deleteFromStorage(parentFolder, mediaTitle, {
        success: () => onMediaDeleteSuccess(mediaTitle),
        error: onDeleteMediaError,
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Media</h2>

      <div className={styles.subContainer}>
        <h3>Loaded Media</h3>
        <div className={styles.loadedMediaContainer}>
          {media.map((item, index) => (
            <div className={styles.loadedMediaSingleContainer} key={index}>
              <h3>{item.title}</h3>

              <div className={styles.loadedMediaUrlDiv}>
                <Typography variant="h6" noWrap>
                  {item.url}
                </Typography>
              </div>

              <Button
                className={styles.mediaButton}
                type="submit"
                color="primary"
                variant="contained"
                onClick={() => copyHtmlButtonOnClick(item.url, item.alt)}
              >
                Copy HTML
              </Button>

              <Button
                className={styles.mediaButton}
                type="submit"
                color="primary"
                variant="contained"
                onClick={() => copyUrlButtonOnClick(item.url)}
              >
                Copy URL
              </Button>

              <Button
                className={styles.mediaButton}
                type="submit"
                color="primary"
                variant="contained"
                onClick={() => copyAltTextButtonOnClick(item.alt)}
              >
                Copy Alt Text
              </Button>

              <Button
                className={styles.mediaButton}
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => deleteButtonOnClick(item.title)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.subContainer}>
        <h3>Add New Media</h3>

        <div className={styles.addMediaContainer}>
          <div className={styles.addMediaRowContainer}>
            <TextField
              className={styles.input}
              label="Title"
              variant="outlined"
              type="text"
              value={newMediaTitle}
              disabled={true}
            />

            <input
              className={styles.fileInput}
              type="file"
              onChange={handleSelectedFileChange}
            />
            {newMediaFile ? (
              <img
                src={newMediaFile}
                className={styles.newMediaPreview}
                alt=""
              />
            ) : null}
          </div>

          <div className={styles.addMediaRowContainer}>
            <TextField
              className={styles.input}
              label="Alt"
              variant="outlined"
              type="text"
              value={newMediaAlt}
              multiline
              rows={3}
              fullWidth
              onChange={(e) => setNewMediaAlt(e.target.value)}
            />
          </div>

          <div className={styles.addMediaRowContainer}>
            {isUploading ? (
              <ClipLoader loading={isUploading} size={15} color="#3f51b5" />
            ) : (
              <Button
                className={styles.mediaButton}
                type="submit"
                color="primary"
                variant="contained"
                onClick={() => addButtonOnClick()}
                disabled={!newMediaValid}
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    backgroundColor: "#eeeeee",

    marginBottom: 25,

    borderRadius: 5,

    padding: 5,
  },
  subContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    marginBottom: 15,
  },
  addMediaContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    marginBottom: 15,
  },
  addMediaRowContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    marginBottom: 15,
  },
  loadedMediaContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  loadedMediaSingleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fafafa",
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 15,
  },
  loadedMediaRowContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    marginBottom: 15,
  },
  loadedMediaUrlDiv: {
    width: "25%",
    overflow: "hidden",
    marginLeft: 25,
    marginRight: 25,
  },

  newMediaPreview: {
    maxWidth: "25vw",
    maxHeight: "25vw",
    objectFit: "contain",
    margin: 25,
  },
  input: {
    marginRight: 15,
  },
  mediaButton: {
    marginRight: 15,
  },
});
