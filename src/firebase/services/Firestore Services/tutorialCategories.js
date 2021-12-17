import { db } from "../../firebase";
import { uploadToStorage, deleteFromStorage } from "../firebaseStorageServices";

import {
  nameError,
  slugError,
  categoryDeleteError,
} from "../../../constants/errors";

import {
  getAllDocumentsOfCollection,
  checkIfNewDocumentIsOk,
  getDocumentByDocumentId,
  deleteDocumentByDocumentId,
} from "../firestoreServices";

export async function getAllTutorialCategories() {
  const result = await getAllDocumentsOfCollection("tutorial-categories");

  return result;
}

export async function checkIfNewTutorialCategoryIsOk(
  newDocumentObject,
  ignoreSlug
) {
  const result1 = await checkIfNewDocumentIsOk(
    "tutorial-categories",
    ["title"],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "tutorial-categories",
      ["slug"],
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

export async function createNewTutorialCategory(
  newDocumentObject,
  telemetryUpdates
) {
  const result = await checkIfNewTutorialCategoryIsOk(newDocumentObject, false);

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
      .collection("tutorial-categories")
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
    .collection("tutorial-categories")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/tutorials/categories/${newDocId}`,
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

export async function getTutorialCategoryByDocId(docId) {
  const result = await getDocumentByDocumentId("tutorial-categories", docId);

  return result;
}

export async function canTutorialCategoryBeDeleted(docId) {
  const result = await db
    .collection("tutorial-subcategories")
    .where("tutorialCategoryDocId", "==", docId)
    .get();

  if (result.docs.length > 0) {
    return false;
  }

  return true;
}

export async function deleteTutorialCategoryByDocId(docId, telemetryUpdates) {
  const isDeleteOk = await canTutorialCategoryBeDeleted(docId);

  if (!isDeleteOk) {
    telemetryUpdates.error({
      message: categoryDeleteError,
    });
    return;
  }

  deleteDocumentByDocumentId("tutorial-categories", docId, telemetryUpdates);
}

export async function updateTutorialCategoryByDocId(
  docId,
  originalDocumentObject,
  newDocumentObject,
  thumbnailUpdate,
  telemetryUpdates
) {
  if (originalDocumentObject.title !== newDocumentObject.title) {
    //check if new title is okay
    const result = await checkIfNewTutorialCategoryIsOk(
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
        .collection("tutorial-categories")
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
        `media/tutorials/categories/${docId}`,
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
      `media/tutorials/categories/${docId}`,
      "thumbnailImage",
      {
        success: onDeleteFromStorageSuccess,
        error: telemetryUpdates.error,
      }
    );
    return;
  }

  await db
    .collection("tutorial-categories")
    .doc(docId)
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}
