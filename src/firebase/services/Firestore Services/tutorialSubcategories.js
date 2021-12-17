import { db } from "../../firebase";
import { uploadToStorage, deleteFromStorage } from "../firebaseStorageServices";

import {
  nameError,
  slugError,
  subcategoryDeleteError,
} from "../../../constants/errors";

import {
  getAllDocumentsOfCollection,
  getConditionalDocumentsOfCollection,
  checkIfNewDocumentIsOk,
  getDocumentByDocumentId,
  deleteDocumentByDocumentId,
} from "../firestoreServices";

export async function getAllTutorialSubcategories() {
  const result = await getAllDocumentsOfCollection("tutorial-subcategories");

  return result;
}

export async function checkIfNewTutorialSubcategoryIsOk(
  newDocumentObject,
  ignoreSlug
) {
  const result1 = await checkIfNewDocumentIsOk(
    "tutorial-subcategories",
    ["tutorialCategoryDocId", "title"],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "tutorial-subcategories",
      ["tutorialCategoryDocId", "slug"],
      newDocumentObject
    );

    if (result2.ok === false) {
      result2.error.message = slugError;
      return result2;
    }
  }

  return {
    ok: true,
    error: {
      message: "",
    },
  };
}

export async function createNewTutorialSubcategory(
  newDocumentObject,
  telemetryUpdates
) {
  const result = await checkIfNewTutorialSubcategoryIsOk(
    newDocumentObject,
    false
  );

  if (!result.ok) {
    telemetryUpdates.error(result.error);
    return;
  }

  let modifiedNewDocumentObject = {
    ...newDocumentObject,
  };

  let newDocId = "";

  const onImageUploadSuccess = async (url) => {
    modifiedNewDocumentObject = {
      thumbnailImage: url,
    };

    await db
      .collection("tutorial-subcategories")
      .doc(newDocId)
      .update({
        thumbnailImage: url,
      })
      .then(() => {
        telemetryUpdates.success();
      })
      .catch((error) => {
        telemetryUpdates.error(error);
      });
  };

  delete modifiedNewDocumentObject.thumbnailImageFile;

  await db
    .collection("tutorial-subcategories")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/tutorials/subcategories/${newDocId}`,
        "thumbnailImage",
        newDocumentObject.thumbnailImageFile,
        {
          success: onImageUploadSuccess,
          progress: telemetryUpdates.progress,
          error: telemetryUpdates.error,
        }
      );
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

export async function getTutorialSubcategoryByDocId(docId) {
  const result = await getDocumentByDocumentId("tutorial-subcategories", docId);

  return result;
}

//PENDING
export async function canTutorialSubcategoryBeDeleted(docId) {
  /*
    const result = await db
      .collection("blog-subcategories")
      .where("blogCategoryDocId", "==", docId)
      .get();
  
    if (result.docs.length > 0) {
      return false;
    }
    */

  return false;
}

export async function deleteTutorialSubcategoryByDocId(
  docId,
  telemetryUpdates
) {
  const isDeleteOk = await canTutorialSubcategoryBeDeleted(docId);

  if (!isDeleteOk) {
    telemetryUpdates.error({
      message: subcategoryDeleteError,
    });
    return;
  }

  deleteDocumentByDocumentId("tutorial-subcategories", docId, telemetryUpdates);
}

export async function getAllTutorialSubcategoriesInTutorialCategory(docId) {
  const keyValuePairs = [
    {
      key: "tutorialCategoryDocId",
      value: docId,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "tutorial-subcategories",
    keyValuePairs
  );

  return result;
}

export async function updateTutorialSubcategoryByDocId(
  docId,
  originalDocumentObject,
  newDocumentObject,
  thumbnailUpdate,
  telemetryUpdates
) {
  if (originalDocumentObject.title !== newDocumentObject.title) {
    //check if new title is okay
    const result = await checkIfNewTutorialSubcategoryIsOk(
      newDocumentObject,
      true
    );

    if (!result.ok) {
      telemetryUpdates.error(result.error);
      return;
    }
  }

  if (thumbnailUpdate.hasThumbnailChanged) {
    //upload thumbnail to storage and get the new URL

    const onImageUploadSuccess = async (url) => {
      const modifiedNewDocumentObject = {
        ...newDocumentObject,
        thumbnailImage: url,
      };

      await db
        .collection("tutorial-subcategories")
        .doc(docId)
        .set(modifiedNewDocumentObject)
        .then(() => {
          telemetryUpdates.success();
        })
        .catch((error) => {
          telemetryUpdates.error(error);
        });
    };

    const onDeleteFromStorageSuccess = async () => {
      await uploadToStorage(
        `media/tutorials/subcategories/${docId}`,
        "thumbnailImage",
        thumbnailUpdate.newThumbnailImageFile,
        {
          success: onImageUploadSuccess,
          progress: telemetryUpdates.progress,
          error: telemetryUpdates.error,
        }
      );
    };

    await deleteFromStorage(
      `media/tutorials/subcategories/${docId}`,
      "thumbnailImage",
      {
        success: onDeleteFromStorageSuccess,
        error: telemetryUpdates.error,
      }
    );
    return;
  }

  await db
    .collection("tutorial-subcategories")
    .doc(docId)
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}
