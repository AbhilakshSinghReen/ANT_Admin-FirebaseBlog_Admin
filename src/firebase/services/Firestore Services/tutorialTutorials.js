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

export async function getAllTutorials() {
  const result = await getAllDocumentsOfCollection("tutorials");

  return result;
}

export async function getAllTutorialsInTutorialSeries(docId) {
  const keyValuePairs = [
    {
      key: "tutorialSeriesDocId",
      value: docId,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "tutorials",
    keyValuePairs
  );

  return result;
}

export async function getAllTutorialsByCollaborator(uid) {
  const keyValuePairs = [
    {
      key: "creatorDocId",
      value: uid,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "tutorials",
    keyValuePairs
  );

  return result;
}

export async function checkIfNewTutorialIsOk(
  newDocumentObject,
  ignoreSlug,
  ignorePart
) {
  const result1 = await checkIfNewDocumentIsOk(
    "tutorials",
    [
      "tutorialCategoryDocId",
      "tutorialSubcategoryDocId",
      "tutorialSeriesDocId",
      "title",
    ],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "tutorials",
      [
        "tutorialCategoryDocId",
        "tutorialSubcategoryDocId",
        "tutorialSeriesDocId",
        "slug",
      ],
      newDocumentObject
    );

    if (result2.ok === false) {
      result2.error.message = slugError;
      return result2;
    }
  }

  if (!ignorePart) {
    const result3 = await checkIfNewDocumentIsOk(
      "tutorials",
      [
        "tutorialCategoryDocId",
        "tutorialSubcategoryDocId",
        "tutorialSeriesDocId",
        "partInSeries",
        "subPartInSeries",
      ],
      newDocumentObject
    );

    if (result3.ok === false) {
      result3.error.message = "This part already exists";
      return result3;
    }
  }

  return {
    ok: true,
    error: {
      message: "",
    },
  };
}

export async function createNewTutorial(newDocumentObject, telemetryUpdates) {
  const result = await checkIfNewTutorialIsOk(newDocumentObject, false, false);

  if (!result.ok) {
    console.log("error in ok");
    telemetryUpdates.error(result.error);
    return;
  }

  let modifiedNewDocumentObject = {
    ...newDocumentObject,
    isDraft: true,
    isApproved: true,
  };

  let newDocId = "";

  const onImageUploadSuccess = async (url) => {
    modifiedNewDocumentObject = {
      thumbnailImage: url,
    };

    await db
      .collection("tutorials")
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
    .collection("tutorials")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/tutorials/tutorials/${newDocId}`,
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

export async function getTutorialByDocId(docId) {
  const result = await getDocumentByDocumentId("tutorials", docId);

  return result;
}

export async function deleteTutorialByDocId(docId, telemetryUpdates) {
  const isDeleteOk = false;

  if (!isDeleteOk) {
    telemetryUpdates.error({
      message: seriesDeleteError,
    });
    return;
  }

  deleteDocumentByDocumentId("tutorials", docId, telemetryUpdates);
}

export async function updateTutorialByDocId(
  docId,
  originalDocumentObject,
  newDocumentObject,
  thumbnailUpdate,
  telemetryUpdates
) {
  if (originalDocumentObject.title !== newDocumentObject.title) {
    //check if new title is okay
    const result = await checkIfNewTutorialIsOk(newDocumentObject, true, true);

    if (!result.ok) {
      telemetryUpdates.error(result.error);
      return;
    }
  }

  //check for part numbers here

  delete newDocumentObject.docId;

  if (thumbnailUpdate.hasThumbnailChanged) {
    //upload thumbnail to storage and get the new URL

    const onImageUploadSuccess = async (url) => {
      const modifiedNewDocumentObject = {
        ...newDocumentObject,
        thumbnailImage: url,
      };

      await db
        .collection("tutorials")
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
        `media/tutorials/tutorials/${docId}`,
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
      `media/tutorials/tutorials/${docId}`,
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
    .collection("tutorials")
    .doc(docId)
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

export async function updateTutorialMediaOnlyByDocId(
  docId,
  stringifiedMediaArray,
  telemetryUpdates
) {
  await db
    .collection("tutorials")
    .doc(docId)
    .update({
      media: stringifiedMediaArray,
    })
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}
