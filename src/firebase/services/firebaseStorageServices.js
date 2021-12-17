import { storage } from "../firebase";

export async function uploadToStorage(
  parentFolder,
  fileName,
  fileObject,
  telemetryUpdates
) {
  const uploadTask = storage.ref(`${parentFolder}/${fileName}`).put(fileObject);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      telemetryUpdates.progress(progress);
    },
    (error) => {
      telemetryUpdates.error(error.message);
    },
    () => {
      storage
        .ref(`${parentFolder}`)
        .child(fileName)
        .getDownloadURL()
        .then((url) => {
          telemetryUpdates.success(url);
        });
    }
  );
}

export async function deleteFromStorage(
  parentFolder,
  fileName,
  telemetryUpdates
) {
  var mediaRef = storage.ref(`${parentFolder}`).child(fileName);

  mediaRef
    .delete()
    .then(() => {
      telemetryUpdates.success(true);
    })
    .catch((error) => {
      telemetryUpdates.error(error.message);
    });
}
