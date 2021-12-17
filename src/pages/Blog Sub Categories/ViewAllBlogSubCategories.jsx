import { useState, useEffect, useContext } from "react";

import UserContext from "../../context/UserContext";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import { useHistory } from "react-router-dom";

import AddIcon from "@material-ui/icons/Add";

import {
  getAllBlogCategories,
  getAllBlogSubCategories,
  deleteBlogSubCategoryByDocId,
} from "../../firebase/services/firestoreServices";

import CollectionDisplayer from "../../components/CollectionDisplayer";

import Loading from "../../components/Loading";
import UserNull from "../../components/UserNull";

import Selector from "../../components/Selector";

import { blogSubCategorySlugs as collectionSlugs } from "../../constants/slugs";

export default function ViewAllBlogSubCategories() {
  const styles = useStyles();
  const history = useHistory();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryDocId, setSelectedCategoryDocId] = useState("");

  const [allDocuments, setAllDocuments] = useState([]);

  const refresh = async () => {
    setIsLoading(true);

    const result1 = await getAllBlogCategories();
    setAllCategories(result1);

    const result2 = await getAllBlogSubCategories();
    setAllDocuments(result2);

    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Blog Subcategories";

    refresh();
  }, []);

  useEffect(() => {
    console.log("Selected category doc id: ", selectedCategoryDocId);
  }, [selectedCategoryDocId]);

  const onDocumentViewClick = (targetDocId) => {
    history.push(
      collectionSlugs.viewDocument.replace(":documentId", targetDocId)
    );
  };

  const onDocumentDeleteSuccess = () => {
    refresh();
    setErrorMessage("");
    setSuccessMessage("Deleted successfully");
    alert("Deleted successfully");
  };

  const onDocumentDeleteError = (error) => {
    setErrorMessage(error.message);
    setSuccessMessage("");
    alert(error.message);
  };

  const onDocumentDeleteClick = async (targetDocument) => {
    if (
      window.confirm(
        `Are you sure you want to delete the blog subcategory: "${targetDocument.title}"?`
      )
    ) {
      deleteBlogSubCategoryByDocId(targetDocument.docId, {
        success: onDocumentDeleteSuccess,
        error: onDocumentDeleteError,
      });
    }
  };

  if (user === null) {
    return <UserNull />;
  }

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <Container className={styles.backgroundContainer}>
      <div className={styles.viewCollectionHeaderDiv}>
        <h1 className={styles.documentAdderHeading}>All Blog Subcategories</h1>
        <IconButton
          variant="contained"
          color="primary"
          onClick={() => history.push(collectionSlugs.createDocument)}
        >
          <AddIcon />
        </IconButton>
      </div>
      <br />
      <Typography color="secondary">{errorMessage}</Typography>
      <Typography color="primary">{successMessage}</Typography>
      <br />

      <Selector
        label="Filter By Category"
        selectedValue={selectedCategoryDocId}
        setSelectedValue={setSelectedCategoryDocId}
        allValues={allCategories}
      />

      {selectedCategoryDocId === ""
        ? allDocuments.map((document, index) => (
            <CollectionDisplayer
              documentName={document.title}
              onView={() => onDocumentViewClick(document.docId)}
              onDelete={() => onDocumentDeleteClick(document)}
              key={index}
            />
          ))
        : allDocuments.map((document, index) =>
            document.blogCategoryDocId === selectedCategoryDocId ? (
              <CollectionDisplayer
                documentName={document.title}
                onView={() => onDocumentViewClick(document.docId)}
                onDelete={() => onDocumentDeleteClick(document)}
                key={index}
              />
            ) : null
          )}
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
  viewCollectionHeaderDiv: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
