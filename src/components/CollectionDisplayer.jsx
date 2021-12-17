import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";

import ViewIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

export default function CollectionDisplayer({
  documentName,
  onView,
  onAdd,
  onEdit,
  onDelete,
}) {
  const styles = useStyles();

  return (
    <Box
      className={styles.collectionDisplayBackgroundBox}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <h1>{documentName}</h1>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {onView ? (
          <IconButton variant="contained" color="primary" onClick={onView}>
            <ViewIcon />
          </IconButton>
        ) : null}

        {onAdd ? (
          <IconButton variant="contained" color="primary" onClick={onAdd}>
            <AddIcon />
          </IconButton>
        ) : null}

        {onEdit ? (
          <IconButton variant="contained" color="primary" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        ) : null}

        {onDelete ? (
          <IconButton variant="contained" color="secondary" onClick={onDelete}>
            <DeleteForeverIcon />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  collectionDisplayBackgroundBox: {
    width: "100%",
    color: "black",
    backgroundColor: "#EEE",
    borderWidth: 1,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 25,
  },
});
