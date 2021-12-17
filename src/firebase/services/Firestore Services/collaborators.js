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

export async function getCollaboratorByDocId(docId) {
  const result = await getDocumentByDocumentId("collaborators", docId);

  return result;
}
