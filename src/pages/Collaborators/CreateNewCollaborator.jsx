import { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import UserNull from "../../components/UserNull";
import ImageFileInput from "../../components/ImageFileInput";
import PrimaryLoader from "../../components/PrimaryLoader";

import CustomDatePicker from "../../components/CustomDatePicker";

import UserContext from "../../context/UserContext";

import { createNewCollaborator } from "../../firebase/services/firestoreServices";

import { nameError } from "../../constants/errors";

export default function CreateNewCollaborator() {
  const styles = useStyles();

  const { user } = useContext(UserContext);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValid =
    name !== "" &&
    email !== "" &&
    password !== null &&
    password === confirmPassword;

  useEffect(() => {
    if (errorMessage === nameError) {
      setErrorMessage("");
    }
  }, [name]);

  useEffect(() => {
    document.name = "Create Collaborator";
  }, []);

  const onCreateSuccess = (docRef) => {
    setIsUploading(false);
    setErrorMessage("");
    setSuccessMessage("Successfully added to the database.");
    setProgress(0);

    setName("");
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

    const newDocumentObject = {
      email: email,
      name: name,
    };

    await createNewCollaborator(newDocumentObject, {
      success: onCreateSuccess,
      progress: onCreateProgress,
      error: onCreateError,
    });
  };

  if (user === null) {
    return <UserNull />;
  }

  return (
    <Container className={styles.backgroundContainer}>
      <h1 className={styles.primaryHeading}>Create a new Collaborator</h1>

      <TextField
        className={styles.primaryInput}
        label="Name"
        variant="outlined"
        fullWidth
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <TextField
        className={styles.primaryInput}
        label="Email"
        variant="outlined"
        fullWidth
        type="text"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <TextField
        className={styles.primaryInput}
        label="Password"
        variant="outlined"
        fullWidth
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <TextField
        className={styles.primaryInput}
        label="Confirm Password"
        variant="outlined"
        fullWidth
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
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
          Create New Collaborator
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
