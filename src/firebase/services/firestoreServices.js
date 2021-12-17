import { db, FieldValue, auth } from "../firebase";
import { uploadToStorage, deleteFromStorage } from "./firebaseStorageServices";

import {
  nameError,
  slugError,
  blogCategoryDeleteError,
  profileAlreadyExistsForThisNetworkError,
} from "../../constants/errors";

import { baseURL } from "../../constants/appDetails";

//GENERAL
export async function getAllDocumentsOfCollection(collectionName) {
  const result = await db.collection(collectionName).get();

  const docs = [];

  result.docs.forEach((doc) => {
    docs.push({
      ...doc.data(),
      docId: doc.id,
    });
  });

  return docs;
}

export async function getConditionalDocumentsOfCollection(
  collectionName,
  keyValuePairs
) {
  let result = null;

  switch (keyValuePairs.length) {
    case 0:
      break;
    case 1:
      result = await db
        .collection(collectionName)
        .where(keyValuePairs[0].key, "==", keyValuePairs[0].value)
        .get();
      break;
    case 2:
      result = await db
        .collection(collectionName)
        .where(keyValuePairs[0].key, "==", keyValuePairs[0].value)
        .where(keyValuePairs[1].key, "==", keyValuePairs[1].value)
        .get();
      break;
    case 3:
      result = await db
        .collection(collectionName)
        .where(keyValuePairs[0].key, "==", keyValuePairs[0].value)
        .where(keyValuePairs[1].key, "==", keyValuePairs[1].value)
        .where(keyValuePairs[2].key, "==", keyValuePairs[2].value)
        .get();
      break;
    case 4:
      result = await db
        .collection(collectionName)
        .where(keyValuePairs[0].key, "==", keyValuePairs[0].value)
        .where(keyValuePairs[1].key, "==", keyValuePairs[1].value)
        .where(keyValuePairs[2].key, "==", keyValuePairs[2].value)
        .where(keyValuePairs[3].key, "==", keyValuePairs[3].value)
        .get();
      break;
    case 5:
      result = await db
        .collection(collectionName)
        .where(keyValuePairs[0].key, "==", keyValuePairs[0].value)
        .where(keyValuePairs[1].key, "==", keyValuePairs[1].value)
        .where(keyValuePairs[2].key, "==", keyValuePairs[2].value)
        .where(keyValuePairs[3].key, "==", keyValuePairs[3].value)
        .where(keyValuePairs[4].key, "==", keyValuePairs[4].value)
        .get();
      break;
    case 6:
      result = await db
        .collection(collectionName)
        .where(keyValuePairs[0].key, "==", keyValuePairs[0].value)
        .where(keyValuePairs[1].key, "==", keyValuePairs[1].value)
        .where(keyValuePairs[2].key, "==", keyValuePairs[2].value)
        .where(keyValuePairs[3].key, "==", keyValuePairs[3].value)
        .where(keyValuePairs[4].key, "==", keyValuePairs[4].value)
        .where(keyValuePairs[5].key, "==", keyValuePairs[5].value)
        .get();
      break;
    default:
      break;
  }

  if (result !== null) {
    const docs = [];

    result.docs.forEach((doc) => {
      docs.push({
        ...doc.data(),
        docId: doc.id,
      });
    });

    return docs;
  }

  return [];
}

export async function checkIfNewDocumentIsOk(
  collectionName,
  uniqueKeys,
  newDocumentObject
) {
  let result = null;
  const returnValue = {
    ok: true,
    error: {
      message: "",
    },
  };

  switch (uniqueKeys.length) {
    case 0:
      break;
    case 1:
      result = await db
        .collection(collectionName)
        .where(uniqueKeys[0], "==", newDocumentObject[uniqueKeys[0]])
        .get();
      returnValue.ok = result.docs.length === 0;
      break;
    case 2:
      result = await db
        .collection(collectionName)
        .where(uniqueKeys[0], "==", newDocumentObject[uniqueKeys[0]])
        .where(uniqueKeys[1], "==", newDocumentObject[uniqueKeys[1]])
        .get();
      returnValue.ok = result.docs.length === 0;
      break;
    case 3:
      result = await db
        .collection(collectionName)
        .where(uniqueKeys[0], "==", newDocumentObject[uniqueKeys[0]])
        .where(uniqueKeys[1], "==", newDocumentObject[uniqueKeys[1]])
        .where(uniqueKeys[2], "==", newDocumentObject[uniqueKeys[2]])
        .get();
      returnValue.ok = result.docs.length === 0;
      break;
    case 4:
      result = await db
        .collection(collectionName)
        .where(uniqueKeys[0], "==", newDocumentObject[uniqueKeys[0]])
        .where(uniqueKeys[1], "==", newDocumentObject[uniqueKeys[1]])
        .where(uniqueKeys[2], "==", newDocumentObject[uniqueKeys[2]])
        .where(uniqueKeys[3], "==", newDocumentObject[uniqueKeys[3]])
        .get();
      returnValue.ok = result.docs.length === 0;
      break;
    case 5:
      result = await db
        .collection(collectionName)
        .where(uniqueKeys[0], "==", newDocumentObject[uniqueKeys[0]])
        .where(uniqueKeys[1], "==", newDocumentObject[uniqueKeys[1]])
        .where(uniqueKeys[2], "==", newDocumentObject[uniqueKeys[2]])
        .where(uniqueKeys[3], "==", newDocumentObject[uniqueKeys[3]])
        .where(uniqueKeys[4], "==", newDocumentObject[uniqueKeys[4]])
        .get();
      returnValue.ok = result.docs.length === 0;
      break;
    case 6:
      result = await db
        .collection(collectionName)
        .where(uniqueKeys[0], "==", newDocumentObject[uniqueKeys[0]])
        .where(uniqueKeys[1], "==", newDocumentObject[uniqueKeys[1]])
        .where(uniqueKeys[2], "==", newDocumentObject[uniqueKeys[2]])
        .where(uniqueKeys[3], "==", newDocumentObject[uniqueKeys[3]])
        .where(uniqueKeys[4], "==", newDocumentObject[uniqueKeys[4]])
        .where(uniqueKeys[5], "==", newDocumentObject[uniqueKeys[5]])
        .get();
      returnValue.ok = result.docs.length === 0;
      break;
    default:
      break;
  }

  return returnValue;
}

export async function getDocumentByDocumentId(
  collectionName,
  targetDocumentId
) {
  const result = await db
    .collection(collectionName)
    .doc(targetDocumentId)
    .get();

  if (!result.exists) {
    return null;
  }

  const doc = {
    ...result.data(),
    docId: result.id,
  };

  return doc;
}

export async function deleteDocumentByDocumentId(
  collectionName,
  targetDocumentId,
  telemetryUpdates
) {
  await db
    .collection(collectionName)
    .doc(targetDocumentId)
    .delete()
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}
//BLOG CATEGORIES
export async function getAllBlogCategories() {
  const result = await getAllDocumentsOfCollection("blog-categories");

  return result;
}

export async function checkIfNewBlogCategoryIsOk(
  newDocumentObject,
  ignoreSlug
) {
  const result1 = await checkIfNewDocumentIsOk(
    "blog-categories",
    ["title"],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "blog-categories",
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

export async function createNewBlogCategory(
  newDocumentObject,
  telemetryUpdates
) {
  const result = await checkIfNewBlogCategoryIsOk(newDocumentObject, false);

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
      .collection("blog-categories")
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
    .collection("blog-categories")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/blog/categories/${newDocId}`,
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

export async function getBlogCategoryByDocId(docId) {
  const result = await getDocumentByDocumentId("blog-categories", docId);

  return result;
}

export async function canBlogCategoryBeDeleted(docId) {
  const result = await db
    .collection("blog-subcategories")
    .where("blogCategoryDocId", "==", docId)
    .get();

  if (result.docs.length > 0) {
    return false;
  }

  return true;
}

export async function deleteBlogCategoryByDocId(docId, telemetryUpdates) {
  const isDeleteOk = await canBlogCategoryBeDeleted(docId);

  if (!isDeleteOk) {
    telemetryUpdates.error({
      message: blogCategoryDeleteError,
    });
    return;
  }

  deleteDocumentByDocumentId("blog-categories", docId, telemetryUpdates);
}

export async function updateBlogCategoryByDocId(
  docId,
  originalDocumentObject,
  newDocumentObject,
  thumbnailUpdate,
  telemetryUpdates
) {
  if (originalDocumentObject.title !== newDocumentObject.title) {
    //check if new title is okay
    const result = await checkIfNewBlogCategoryIsOk(newDocumentObject, true);

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
        .collection("blog-categories")
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
        `media/blog/categories/${docId}`,
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
      `media/blog/categories/${docId}`,
      "thumbnailImage",
      {
        success: onDeleteFromStorageSuccess,
        error: telemetryUpdates.error,
      }
    );
    return;
  }

  await db
    .collection("blog-categories")
    .doc(docId)
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

//BLOG SUB CATEGORIES
export async function getAllBlogSubCategories() {
  const result = await getAllDocumentsOfCollection("blog-subcategories");

  return result;
}

export async function checkIfNewBlogSubCategoryIsOk(
  newDocumentObject,
  ignoreSlug
) {
  const result1 = await checkIfNewDocumentIsOk(
    "blog-subcategories",
    ["blogCategoryDocId", "title"],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "blog-subcategories",
      ["blogCategoryDocId", "slug"],
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

export async function createNewBlogSubCategory(
  newDocumentObject,
  telemetryUpdates
) {
  const result = await checkIfNewBlogSubCategoryIsOk(newDocumentObject, false);

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
      .collection("blog-subcategories")
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
    .collection("blog-subcategories")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/blog/subcategories/${newDocId}`,
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

export async function getBlogSubCategoryByDocId(docId) {
  const result = await getDocumentByDocumentId("blog-subcategories", docId);

  return result;
}

export async function canBlogSubCategoryBeDeleted(docId) {
  /*
  const result = await db
    .collection("blog-subcategories")
    .where("blogCategoryDocId", "==", docId)
    .get();

  if (result.docs.length > 0) {
    return false;
  }
  */

  return true;
}

export async function deleteBlogSubCategoryByDocId(docId, telemetryUpdates) {
  const isDeleteOk = await canBlogSubCategoryBeDeleted(docId);

  if (!isDeleteOk) {
    telemetryUpdates.error({
      message: blogCategoryDeleteError,
    });
    return;
  }

  deleteDocumentByDocumentId("blog-subcategories", docId, telemetryUpdates);
}

export async function getAllBlogSubCategoriesInBlogCategory(docId) {
  const keyValuePairs = [
    {
      key: "blogCategoryDocId",
      value: docId,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "blog-subcategories",
    keyValuePairs
  );

  return result;
}

export async function updateBlogSubCategoryByDocId(
  docId,
  originalDocumentObject,
  newDocumentObject,
  thumbnailUpdate,
  telemetryUpdates
) {
  if (originalDocumentObject.title !== newDocumentObject.title) {
    //check if new title is okay
    const result = await checkIfNewBlogSubCategoryIsOk(newDocumentObject, true);

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
        .collection("blog-subcategories")
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
        `media/blog/subcategories/${docId}`,
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
      `media/blog/subcategories/${docId}`,
      "thumbnailImage",
      {
        success: onDeleteFromStorageSuccess,
        error: telemetryUpdates.error,
      }
    );
    return;
  }

  await db
    .collection("blog-subcategories")
    .doc(docId)
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

//BLOG POSTS
export async function getAllBlogPosts() {
  const result = await getAllDocumentsOfCollection("blog-posts");

  return result;
}

export async function getAllBlogPostsInBlogCategory(docId) {
  const keyValuePairs = [
    {
      key: "blogCategoryDocId",
      value: docId,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "blog-posts",
    keyValuePairs
  );

  //console.log("Subcategories: ", result);

  return result;
}

export async function getAllBlogPostsInBlogSubCategory(docId) {
  const keyValuePairs = [
    {
      key: "blogSubcategoryDocId",
      value: docId,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "blog-posts",
    keyValuePairs
  );

  //console.log("Subcategories: ", result);

  return result;
}

export async function getAllBlogPostsByCollaborator(uid) {
  const keyValuePairs = [
    {
      key: "creatorDocId",
      value: uid,
    },
  ];

  const result = await getConditionalDocumentsOfCollection(
    "blog-posts",
    keyValuePairs
  );

  //console.log("Subcategories: ", result);

  return result;
}

export async function checkIfNewBlogPostIsOk(newDocumentObject, ignoreSlug) {
  const result1 = await checkIfNewDocumentIsOk(
    "blog-posts",
    ["blogCategoryDocId", "blogSubcategoryDocId", "title"],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "blog-posts",
      ["blogCategoryDocId", "blogSubcategoryDocId", "slug"],
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

export async function createNewBlogPost(newDocumentObject, telemetryUpdates) {
  const result = await checkIfNewBlogPostIsOk(newDocumentObject, false);

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
      .collection("blog-posts")
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
    .collection("blog-posts")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/blog/posts/${newDocId}`,
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

export async function createNewBlogPost2(newDocumentObject, telemetryUpdates) {
  const result = await checkIfNewBlogPostIsOk(newDocumentObject, false);

  if (!result.ok) {
    telemetryUpdates.error(result.error);
    return;
  }

  let modifiedNewDocumentObject = {
    ...newDocumentObject,
    isDraft: true,
  };

  await db
    .collection("blog-posts")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      telemetryUpdates.success(docRef);
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

export async function getBlogPostByDocId(docId) {
  const result = await getDocumentByDocumentId("blog-posts", docId);

  return result;
}

export async function deleteBlogPostByDocId(docId, telemetryUpdates) {
  const isDeleteOk = true;

  if (!isDeleteOk) {
    telemetryUpdates.error({
      message: blogCategoryDeleteError,
    });
    return;
  }

  deleteDocumentByDocumentId("blog-posts", docId, telemetryUpdates);
}

export async function updateBlogPostByDocId(
  docId,
  originalDocumentObject,
  newDocumentObject,
  thumbnailUpdate,
  telemetryUpdates
) {
  if (originalDocumentObject.title !== newDocumentObject.title) {
    //check if new title is okay
    const result = await checkIfNewBlogPostIsOk(newDocumentObject, true);

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
        .collection("blog-posts")
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
        `media/blog/posts/${docId}`,
        "thumbnailImage",
        thumbnailUpdate.newThumbnailImageFile,
        {
          success: onImageUploadSuccess,
          progress: telemetryUpdates.progress,
          error: telemetryUpdates.error,
        }
      );
    };

    await deleteFromStorage(`media/blog/posts/${docId}`, "thumbnailImage", {
      success: onDeleteFromStorageSuccess,
      error: (error) => {
        telemetryUpdates.error(error);
      },
    });
    return;
  }

  await db
    .collection("blog-posts")
    .doc(docId)
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

export async function updateBlogPostMediaOnlyByDocId(
  docId,
  stringifiedMediaArray,
  telemetryUpdates
) {
  await db
    .collection("blog-posts")
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

//CONNECT
export async function getAllSupportedSocialNetworks() {
  return [
    {
      title: "Discord",
      docId: "discord",
    },
    {
      title: "YouTube",
      docId: "youtube",
    },
    {
      title: "Instagram",
      docId: "instagram",
    },
  ];
}

export async function checkIfNewRootSocialNetworkProfileIsOk(newProfileObject) {
  const returnValue = {
    ok: true,
    error: {
      message: "",
    },
  };

  const result = await db
    .collection("root")
    .doc("rootSocialNetworkProfiles")
    .get();

  const rootSocialNetworkProfilesDocument = result.data();

  const rootSocialNetworkProfiles = rootSocialNetworkProfilesDocument.profiles;

  rootSocialNetworkProfiles.forEach((item, index) => {
    if (returnValue.ok) {
      const profile = JSON.parse(item);

      if (profile.networkName === newProfileObject.networkName) {
        returnValue.ok = false;
      }
    }
  });

  return returnValue;
}

export async function createNewRootSocialNetworkProfile(
  newProfileObject,
  telemetryUpdates
) {
  const isOk = await checkIfNewRootSocialNetworkProfileIsOk(newProfileObject);

  if (!isOk.ok) {
    telemetryUpdates.error({
      message: profileAlreadyExistsForThisNetworkError,
    });
    return;
  }

  await db
    .collection("root")
    .doc("rootSocialNetworkProfiles")
    .update({
      profiles: FieldValue.arrayUnion(JSON.stringify(newProfileObject)),
    })
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

export async function deleteRootSocialNetworkProfile(
  profile,
  telemetryUpdates
) {
  await db
    .collection("root")
    .doc("rootSocialNetworkProfiles")
    .update({
      profiles: FieldValue.arrayRemove(JSON.stringify(profile)),
    })
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

export async function getAllRootSocialNetworkProfiles() {
  const result = await db
    .collection("root")
    .doc("rootSocialNetworkProfiles")
    .get();

  const rootSocialNetworkProfilesDocument = result.data();

  const rootSocialNetworkProfiles =
    rootSocialNetworkProfilesDocument.profiles.map((item) => JSON.parse(item));

  return rootSocialNetworkProfiles;
}

//ABOUT
export async function getAbout() {
  const result = await db.collection("root").doc("about").get();

  const originalDocumentObject = result.data();

  const date = originalDocumentObject.dateUpdated;

  return {
    ...originalDocumentObject,
    dateUpdated: date.toDate(),
  };
}

export async function updateAbout(newDocumentObject, telemetryUpdates) {
  await db
    .collection("root")
    .doc("about")
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

//PRIVACY POLICY
export async function getPrivacyPolicy() {
  const result = await db.collection("root").doc("privacyPolicy").get();

  const originalDocumentObject = result.data();

  const date = originalDocumentObject.dateUpdated;

  return {
    ...originalDocumentObject,
    dateUpdated: date.toDate(),
  };
}

export async function updatePrivacyPolicy(newDocumentObject, telemetryUpdates) {
  await db
    .collection("root")
    .doc("privacyPolicy")
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

//TERMS AND CONDITIONS
export async function getTermsAndConditions() {
  const result = await db.collection("root").doc("termsAndConditions").get();

  const originalDocumentObject = result.data();

  const date = originalDocumentObject.dateUpdated;

  return {
    ...originalDocumentObject,
    dateUpdated: date.toDate(),
  };
}

export async function updateTermsAndConditions(
  newDocumentObject,
  telemetryUpdates
) {
  await db
    .collection("root")
    .doc("termsAndConditions")
    .set(newDocumentObject)
    .then(() => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });
}

//COLLABORATORS
export async function checkIfNewCollaboratorIsOk(newDocumentObject) {
  /*
  const result1 = await checkIfNewDocumentIsOk(
    "blog-categories",
    ["title"],
    newDocumentObject
  );

  if (result1.ok === false) {
    result1.error.message = nameError;
    return result1;
  }

  if (!ignoreSlug) {
    const result2 = await checkIfNewDocumentIsOk(
      "blog-categories",
      ["slug"],
      newDocumentObject
    );

    if (result2.ok === false) {
      result2.error.message = slugError;
      return result2;
    }
  }
  */

  return {
    ok: true,
    error: {
      message: "",
    },
  };
}

export async function createNewCollaborator(
  newDocumentObject,
  telemetryUpdates
) {
  const result = await checkIfNewCollaboratorIsOk(newDocumentObject);

  if (!result.ok) {
    telemetryUpdates.error(result.error);
    return;
  }

  let modifiedNewDocumentObject = {
    ...newDocumentObject,
  };

  await db
    .collection("collaborators")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      telemetryUpdates.success();
    })
    .catch((error) => {
      telemetryUpdates.error(error);
    });

  /*
  let newDocId = "";
  const onImageUploadSuccess = async (url) => {
    modifiedNewDocumentObject = {
      thumbnailImage: url,
    };

    await db
      .collection("blog-categories")
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
    .collection("blog-categories")
    .add(modifiedNewDocumentObject)
    .then(async (docRef) => {
      newDocId = docRef.id;

      await uploadToStorage(
        `media/blog/categories/${newDocId}`,
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
    */
}

export async function getCollaboratorFromSuperAdminUid(uid) {
  const result = getDocumentByDocumentId("collaborators", uid);

  return result;
}

export async function checkIfSuperAdminIsAlsoCollaborator() {
  console.log("Current user: ", auth.currentUser);
}

export async function getAllCollaborators() {
  const result = await getAllDocumentsOfCollection("collaborators");

  return result;
}

//SITEMAP

export async function generateSitemap(telemetryUpdates) {
  //Getting data
  const termsAndConditionsResult = await getTermsAndConditions();
  const privacyPolicyResult = await getPrivacyPolicy();
  const aboutResult = await getAbout();
  const blogCategoriesResult = await getAllBlogCategories();
  const blogSubCategoriesResult = await getAllBlogSubCategories();
  const blogPostsResult = await getAllBlogPosts();

  var todayDate = new Date();
  var firstDayOfCurrentMonth = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    1
  );

  const pages = [];

  //Adding Terms and conditions
  pages.push({
    loc: "terms-and-conditions",
    lastmod: termsAndConditionsResult.dateUpdated.toISOString(),
    changefreq: "yearly",
    priority: 1,
  });

  //Adding Privacy Policy
  pages.push({
    loc: "privacy-policy",
    lastmod: privacyPolicyResult.dateUpdated.toISOString(),
    changefreq: "yearly",
    priority: 1,
  });

  //Adding About
  const aboutUpdateDate = aboutResult.dateUpdated.toISOString();
  pages.push({
    loc: "about",
    lastmod: aboutUpdateDate,
    changefreq: "yearly",
    priority: 0.2,
  });

  //Adding Connect
  pages.push({
    loc: "connect",
    lastmod: aboutUpdateDate,
    changefreq: "yearly",
    priority: 0.2,
  });

  //Adding Blog Categories
  blogCategoriesResult.forEach((item, index) => {
    pages.push({
      loc: `blog/${item.slug}`,
      lastmod: firstDayOfCurrentMonth.toISOString(),
      changefreq: "monthly",
      priority: 0.2,
    });
  });

  //Adding Blog Subcategories
  blogSubCategoriesResult.forEach((item, index) => {
    pages.push({
      loc: `blog/${item.blogCategorySlug}/${item.slug}`,
      lastmod: firstDayOfCurrentMonth.toISOString(),
      changefreq: "monthly",
      priority: 0.2,
    });
  });

  //Adding Blog Posts
  blogPostsResult.forEach((item, index) => {
    pages.push({
      loc: `blog/${item.blogCategorySlug}/${item.blogSubcategorySlug}/${item.slug}`,
      lastmod: item.dateUpdated.toDate().toISOString(),
      changefreq: "yearly",
      priority: 1,
    });
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          return `
            <url>            
            <loc>${baseURL}/${page.loc}</loc>              
              <lastmod>${page.lastmod}</lastmod>              
              <changefreq>${page.changefreq}</changefreq>              
              <priority>${page.priority}</priority>              
            </url>
          `;
        })
        .join("")}        
    </urlset>
  `;

  telemetryUpdates.success(sitemapXml);
}

/*
Required functions for each collection.
getAll
checkIfNewIsOk
createNew
getByDocId
deleteByDocId
updateByDocId

*/
