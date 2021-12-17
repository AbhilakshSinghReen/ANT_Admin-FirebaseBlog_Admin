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
  getAllBlogSubCategoriesInBlogCategory,
  getAllCollaborators,
  //
  deleteBlogPostByDocId,
  //
  getAllBlogPosts,
  getAllBlogPostsInBlogCategory,
  getAllBlogPostsInBlogSubCategory,
  getAllBlogPostsByCollaborator,
} from "../../firebase/services/firestoreServices";

import CollectionDisplayer from "../../components/CollectionDisplayer";

import Loading from "../../components/Loading";
import UserNull from "../../components/UserNull";

import Selector from "../../components/Selector";

import { blogPostSlugs as collectionSlugs } from "../../constants/slugs";

export default function ViewAllBlogPosts() {
  const styles = useStyles();
  const history = useHistory();

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryDocId, setSelectedCategoryDocId] = useState("");

  const [allSubcategoriesInCategory, setAllSubcategoriesInCategory] = useState(
    []
  );
  const [selectedSubcategoryDocId, setSelectedSubcategoryDocId] = useState("");

  const [allCreators, setAllCreators] = useState([]);
  const [selectedCreatorDocId, setSelectedCreatorDocId] = useState("");

  const [allDocuments, setAllDocuments] = useState([]);

  const refresh = async () => {
    setIsLoading(true);

    const result1 = await getAllBlogCategories();
    setAllCategories(result1);

    const result2 = await getAllCollaborators();
    setAllCreators(result2);

    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Blog Posts";

    refresh();
  }, []);

  const getAllBlogSubCategoriesInBlogCategoryFromDb = async () => {
    const result = await getAllBlogSubCategoriesInBlogCategory(
      selectedCategoryDocId
    );
    setAllSubcategoriesInCategory(result);
  };

  useEffect(() => {
    getAllBlogSubCategoriesInBlogCategoryFromDb();
  }, [selectedCategoryDocId]);

  const loadButtonOnClick = async (preventConfirm) => {
    let result = [];
    if (selectedSubcategoryDocId !== "" && selectedCreatorDocId !== "") {
      //get for sub category and creator
      alert(
        "Cannot load when both subcategory and creator have been selected."
      );
    } else if (selectedCategoryDocId !== "" && selectedCreatorDocId !== "") {
      //get for category and creator
      alert("Cannot load when both category and creator have been selected.");
    } else if (selectedCreatorDocId !== "") {
      //get for creator only
      result = await getAllBlogPostsByCollaborator(selectedCreatorDocId);
    } else if (selectedSubcategoryDocId !== "") {
      //get for subcategory only
      result = await getAllBlogPostsInBlogSubCategory(selectedSubcategoryDocId);
    } else if (selectedCategoryDocId !== "") {
      //get for category only
      result = await getAllBlogPostsInBlogCategory(selectedCategoryDocId);
    } else {
      //get all
      if (preventConfirm) {
        result = await getAllBlogPosts();
      } else {
        if (
          window.confirm(
            `Are you sure you want to load?
This may cause a huge number of document reads!`
          )
        ) {
          result = await getAllBlogPosts();
        }
      }
    }

    setAllDocuments(result);
  };

  const onDocumentViewClick = (targetDocId) => {
    history.push(
      collectionSlugs.viewDocument.replace(":documentId", targetDocId)
    );
  };

  const onDocumentDeleteSuccess = () => {
    loadButtonOnClick(true);
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
        `Are you sure you want to delete the blog post: "${targetDocument.title}"?`
      )
    ) {
      deleteBlogPostByDocId(targetDocument.docId, {
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
        <h1 className={styles.documentAdderHeading}>All Blog Posts</h1>
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

      <Selector
        label="Filter By Subcategory"
        selectedValue={selectedSubcategoryDocId}
        setSelectedValue={setSelectedSubcategoryDocId}
        allValues={allSubcategoriesInCategory}
      />

      <Selector
        label="Filter By Creator"
        selectedValue={selectedCreatorDocId}
        setSelectedValue={setSelectedCreatorDocId}
        allValues={allCreators}
      />

      <Button
        className={styles.primaryButton}
        type="submit"
        color="primary"
        variant="contained"
        onClick={() => loadButtonOnClick(false)}
      >
        Load
      </Button>

      {allDocuments.map((document, index) => (
        <CollectionDisplayer
          documentName={document.title}
          onView={() => onDocumentViewClick(document.docId)}
          onDelete={() => onDocumentDeleteClick(document)}
          key={index}
        />
      ))}
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
