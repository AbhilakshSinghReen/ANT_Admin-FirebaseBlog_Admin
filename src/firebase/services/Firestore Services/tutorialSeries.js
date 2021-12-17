import { db } from "../../firebase";
import { uploadToStorage, deleteFromStorage } from "../firebaseStorageServices";

import {
  getAllDocumentsOfCollection,
  getConditionalDocumentsOfCollection,
  checkIfNewDocumentIsOk,
  getDocumentByDocumentId,
  deleteDocumentByDocumentId,
} from "../firestoreServices";

import {
  nameError,
  slugError,
  seriesDeleteError,
} from "../../../constants/errors";

export async function getAllTutorialSeries() {
  const result = await getAllDocumentsOfCollection("tutorial-series");

  return result;
}

//export async function getAllTutorialsInTutorialSeries(docId) {}

export async function getAllTutorialSeriesInTutorialCategory(docId) {
  const keyValuePairs = [
    {
      key: "tutorialCategoryDocId",
      value: docId,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "tutorial-series",
    keyValuePairs
  );

  return result;
}

export async function getAllTutorialSeriesInTutorialSubcategory(docId) {
  const keyValuePairs = [
    {
      key: "tutorialSubcategoryDocId",
      value: docId,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "tutorial-series",
    keyValuePairs
  );

  return result;
}

export async function getAllTutorialSeriesByCollaborator(uid) {
  const keyValuePairs = [
    {
      key: "creatorDocId",
      value: uid,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "tutorial-series",
    keyValuePairs
  );

  return result;
}

export async function checkIfNewTutorialSeriesIsOk(
  newDocumentObject,
  ignoreSlug
) {
  const result1 = await checkIfNewDocumentIsOk(
    "tutorial-series",
    ["tutorialCategoryDocId", "tutorialSubcategoryDocId", "title"],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "tutorial-series",
      ["tutorialCategoryDocId", "tutorialSubcategoryDocId", "slug"],
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

export async function createNewTutorialSeries(
  newDocumentObject,
  telemetryUpdates
) {
  const result = await checkIfNewTutorialSeriesIsOk(newDocumentObject, false);

  if (!result.ok) {
    console.log("error in ok");
    telemetryUpdates.error(result.error);
    return;
  }

  let modifiedNewDocumentObject = {
    ...newDocumentObject,
    isDraft: true,
  };

  let newDocId = "";

  const onImageUploadSuccess = async (url) => {
    modifiedNewDocumentObject = {
      thumbnailImage: url,
    };

    await db
      .collection("tutorial-series")
      .doc(newDocId)
      .update({
        thumbnailImage: url,
      })
      .then(() => {
        telemetryUpdates.success({
          id: newDocId,
        });
      })
      .catch((error) => {
        telemetryUpdates.error(error);
        console.log("error in update");
        console.log(error);
      });
  };

  delete modifiedNewDocumentObject.thumbnailImageFile;

  await db
    .collection("tutorial-series")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/tutorials/series/${newDocId}`,
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
      console.log("error in add");
      console.log(error);
    });
}

export async function getTutorialSeriesByDocId(docId) {
  const result = await getDocumentByDocumentId("tutorial-series", docId);

  return result;
}

export async function deleteTutorialSeriesByDocId(docId, telemetryUpdates) {
  const isDeleteOk = false;

  if (!isDeleteOk) {
    telemetryUpdates.error({
      message: seriesDeleteError,
    });
    return;
  }

  deleteDocumentByDocumentId("tutorial-series", docId, telemetryUpdates);
}

export async function updateTutorialSeriesByDocId(
  docId,
  originalDocumentObject,
  newDocumentObject,
  thumbnailUpdate,
  telemetryUpdates
) {
  if (originalDocumentObject.title !== newDocumentObject.title) {
    //check if new title is okay
    const result = await checkIfNewTutorialSeriesIsOk(newDocumentObject, true);

    if (!result.ok) {
      telemetryUpdates.error(result.error);
      return;
    }
  }

  delete newDocumentObject.docId;

  if (thumbnailUpdate.hasThumbnailChanged) {
    //upload thumbnail to storage and get the new URL

    const onImageUploadSuccess = async (url) => {
      const modifiedNewDocumentObject = {
        ...newDocumentObject,
        thumbnailImage: url,
      };

      await db
        .collection("tutorial-series")
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
        `media/tutorials/series/${docId}`,
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
      `media/tutorials/series/${docId}`,
      "thumbnailImage",
      {
        success: onDeleteFromStorageSuccess,
        error: (error) => {
          telemetryUpdates.error(error);
        },
      }
    );
    return;
  }

  await db
    .collection("tutorial-series")
    .doc(docId)
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}
