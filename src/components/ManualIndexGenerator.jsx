import { useState } from "react";

import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

export default function ManualIndexGenerator({ index, setIndex }) {
  const styles = useStyles();

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState(0);
  const [anchorName, setAnchorName] = useState("");

  const addButtonOnClick = () => {
    const newIndex = [...index];

    newIndex.push({
      title: title,
      level: level,
      anchorName: anchorName,
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

  return (
    <div className={styles.container}>
      <h2>Index</h2>
      <div className={styles.addContainer}>
        <TextField
          className={styles.indexInput}
          label="Title"
          variant="outlined"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          className={styles.indexInput}
          label="Level"
          variant="outlined"
          type="text"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          fullWidth
        />

        <TextField
          className={styles.indexInput}
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
          <div className={styles.addedItemContainer}>
            <div
              className={styles.addedItemContainer1}
              style={{ marginLeft: 10 * item.level }}
            >
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
                label="Level"
                variant="outlined"
                type="text"
                value={item.level}
                onChange={(e) => updateItem(itemIndex, "level", e.target.value)}
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
            </div>

            <IconButton
              className={styles.mediaButton}
              type="submit"
              color="secondary"
              variant="contained"
              onClick={() => deleteButtonOnClick()}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
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
    marginBottom: 15,
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
  addedItemContainer1: {
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
});
