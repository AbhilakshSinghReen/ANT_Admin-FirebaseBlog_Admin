import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import AddIcon from "@material-ui/icons/Add";

import ClipLoader from "react-spinners/ClipLoader";

import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from "@material-ui/icons/Delete";

import IndexItem from "./IndexItem";

import { array_move, moveItemToNewIndex } from "../helpers/jsHelpers";

/*
INDEX FORMAT

index = [
  {
    title: "",
    anchorName: "",
    subIndex: [
      {
        title: "",
        anchorName: "",
        subIndex: [
          //if there are no sub items then the subindex array will be empty
        ]
      }
    ]
  }

]

*/

export default function IndexGenerator({ index, setIndex }) {
  const styles = useStyles();

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState(0);
  const [anchorName, setAnchorName] = useState("");

  const addButtonOnClick = () => {
    const newIndex = [...index];

    newIndex.push({
      title: title,
      level: level,
      subIndex: [],
    });

    setIndex(newIndex);
  };

  const deleteButtonOnClick = (itemIndex) => {
    const newIndex = [...index];

    newIndex.splice(itemIndex, 1);

    setIndex(newIndex);
  };

  const updateItem = (itemIndex, key, newValue) => {
    const newIndex = [...index];
    newIndex[itemIndex][key] = newValue;
    setIndex(newIndex);
  };

  //const addSubItem=(itemLevel, itemIndex)

  return (
    <div className={styles.container}>
      <IndexItem />
      {/*}
      <h2>Index</h2>
      <div className={styles.addContainer}>
        <TextField
          className={styles.indexRowInput}
          label="Title"
          variant="outlined"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <TextField
          className={styles.indexRowInput}
          label="Anchor name"
          variant="outlined"
          type="text"
          value={anchorName}
          onChange={(e) => setAnchorName(e.target.value)}
          fullWidth
        />

        <Button
          className={styles.mediaButton}
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => addButtonOnClick()}
          disabled={!(title !== "" && level !== "" && anchorName !== "")}
        >
          Add
        </Button>
      </div>

      <div className={styles.addedContainer}>
        {index.map((item, itemIndex) => (
          <div>
            <div className={styles.addedItemContainer}>
              <h3 className={styles.indexRowInput}>{itemIndex + 1}) </h3>

              {/*<h1 style={{ marginRight: 25 }}>Hello</h1>

              <TextField
                className={styles.indexRowInput}
                label="Title"
                variant="outlined"
                type="text"
                value={item.title}
                onChange={(e) => updateItem(itemIndex, "title", e.target.value)}
                fullWidth
              />

              <TextField
                className={styles.indexRowInput}
                label="Anchor name"
                variant="outlined"
                type="text"
                value={item.anchorName}
                onChange={(e) =>
                  updateItem(itemIndex, "anchorName", e.target.value)
                }
                fullWidth
              />

              <IconButton
                className={styles.mediaButton}
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => deleteButtonOnClick(itemIndex)}
              >
                <DeleteIcon />
              </IconButton>
            </div>

            <div className={styles.addContainer}>
              <TextField
                className={styles.indexRowInput}
                label="Title"
                variant="outlined"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />

              <TextField
                className={styles.indexRowInput}
                label="Anchor name"
                variant="outlined"
                type="text"
                value={anchorName}
                onChange={(e) => setAnchorName(e.target.value)}
                fullWidth
              />

              <Button
                className={styles.mediaButton}
                type="submit"
                color="primary"
                variant="contained"
                onClick={() => addButtonOnClick()}
                disabled={!(title !== "" && level !== "" && anchorName !== "")}
              >
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
      <h2>Preview</h2>
      <div className={styles.previewContainer}>
        <h2>Preview</h2>
        <h2>Preview</h2>
        <h2>Preview</h2>
      </div>
      */}
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    padding: 15,

    marginBottom: 25,

    backgroundColor: "#fafafa",

    borderRadius: 5,
  },
  addContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    //marginBottom: 15,

    marginBottom: 50,
  },
  addedContainer: {
    marginBottom: 15,
  },
  addedItemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    marginBottom: 10,
  },
  indexInput: {
    marginBottom: 10,
  },
  indexRowInput: {
    marginRight: 10,
  },
  previewContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    backgroundColor: "white",

    borderRadius: 5,

    padding: 10,
  },
});
