import { useState } from "react";

import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { imageFileTypes } from "../constants/fileTypes";

import { incorrectImageFormatError } from "../constants/errors";

export default function ImageFileInput({
  label,
  setImageFile,
  defaultImageURL,
}) {
  const styles = useStyles();

  const [error, setError] = useState("");

  const [imageFileTempURL, setImageFileTempURL] = useState("");

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      if (
        imageFileTypes.includes(event.target.files[0].name?.split(".").pop())
      ) {
        setImageFile(event.target.files[0]);
        setImageFileTempURL(URL.createObjectURL(event.target.files[0]));

        if (error === incorrectImageFormatError) {
          setError("");
        }
      } else {
        event.target.value = null;
        setError(incorrectImageFormatError);
      }
    }
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography
          className={styles.fileInputLabel}
          variant="h6"
          color="primary"
        >
          {label}:
        </Typography>
        <input
          className={styles.fileInput}
          type="file"
          onChange={(event) => handleImageChange(event)}
        />
        {imageFileTempURL ? (
          <img
            src={imageFileTempURL}
            className={styles.thumbnailPreview}
            alt=""
          />
        ) : defaultImageURL ? (
          <img
            src={defaultImageURL}
            className={styles.thumbnailPreview}
            alt=""
          />
        ) : null}
      </Box>
      <Typography color="secondary">{error}</Typography>
    </div>
  );
}

const useStyles = makeStyles({
  //backgroundDiv: {},
  fileInputLabel: {
    fontWeight: "bolder",
    margin: 15,
  },
  thumbnailPreview: {
    maxWidth: "25vw",
    maxHeight: "25vw",
    objectFit: "contain",
    margin: 25,
  },
  fileInput: {},
});
