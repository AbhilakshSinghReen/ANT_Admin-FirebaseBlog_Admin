import { imageFileTypes } from "./fileTypes";

export const incorrectFileFormatError = (acceptedFileFormats) => {
  return `This file format is not accepted. Accepted file formats are: ${acceptedFileFormats.toString()}`;
};

export const nameError = "This name is already taken.";

export const slugError = "This slug is already taken.";

export const profileAlreadyExistsForThisNetworkError =
  "A social network profile already exists for this network.";

export const notLoggedInError = "You need to be logged in to view this page.";

export const incorrectImageFormatError = `This file format is not accepted. Accepted file formats are: ${imageFileTypes.toString()}`;

export const blogCategoryDeleteError = `This category cannot be deleted as it contains one or more subcategories.`;

export const categoryDeleteError = `This category cannot be deleted as it contains one or more subcategories.`;

export const subcategoryDeleteError = `This subcategory cannot be deleted as it contains one or more items.`;

export const seriesDeleteError = `This series cannot be deleted as it contains one or more items.`;

export const mediaUploadErrors = {
  invalidFileType: "Invalid file type.",
  noFileChosen: "No file chosen",
};
