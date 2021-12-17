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

export default function IndexItem({ index, setIndex }) {
  const styles = useStyles();

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState(0);
  const [anchorName, setAnchorName] = useState("");

  const [item, setItem] = useState({
    title: "",
    anchorName: "",
    subItems: [],
  });

  const [isAddingSubItem, setIsAddingSubItem] = useState("");

  const addSubItem = () => {
    const newItem = { ...item };
    //hello

    newItem.subItems.push({
      title: "ok",
      anchorName: "also ok",
      subItems: [],
    });

    console.log("new Item: ", newItem);

    setItem(newItem);
  };

  useEffect(() => {
    console.log("Item: ", item);
  }, [item]);

  return (
    <div>
      <div className={styles.rowContainer}>
        <TextField
          className={styles.indexRowInput}
          label="Title"
          variant="outlined"
          type="text"
          value={item.title}
          //onChange={(e) => updateItem(itemIndex, "title", e.target.value)}
          fullWidth
        />

        <TextField
          className={styles.indexRowInput}
          label="Anchor name"
          variant="outlined"
          type="text"
          value={item.anchorName}
          //onChange={(e) => updateItem(itemIndex, "anchorName", e.target.value)}
          fullWidth
        />

        <IconButton
          className={styles.mediaButton}
          type="submit"
          color="secondary"
          variant="contained"
          //onClick={() => deleteButtonOnClick(itemIndex)}
        >
          <DeleteIcon />
        </IconButton>

        <IconButton
          className={styles.mediaButton}
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => addSubItem()}
        >
          <AddIcon />
        </IconButton>
      </div>

      {item.subItems.map((subItem, subItemIndex) => (
        <div
          className={styles.rowContainer}
          style={{
            marginLeft: 50,
          }}
        >
          <TextField
            className={styles.indexRowInput}
            label="Title"
            variant="outlined"
            type="text"
            value={subItem.title}
            //onChange={(e) => updateItem(itemIndex, "title", e.target.value)}
            fullWidth
          />

          <TextField
            className={styles.indexRowInput}
            label="Anchor name"
            variant="outlined"
            type="text"
            value={subItem.anchorName}
            //onChange={(e) => updateItem(itemIndex, "anchorName", e.target.value)}
            fullWidth
          />

          <IconButton
            className={styles.mediaButton}
            type="submit"
            color="secondary"
            variant="contained"
            //onClick={() => deleteButtonOnClick(itemIndex)}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            className={styles.mediaButton}
            type="submit"
            color="primary"
            variant="contained"
            //onClick={() => deleteButtonOnClick(itemIndex)}
          >
            <AddIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    width: "100%",

    height: 500,

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    padding: 15,

    marginBottom: 25,

    backgroundColor: "#fafafa",

    borderRadius: 5,
  },

  rowContainer: {
    width: "100%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

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
