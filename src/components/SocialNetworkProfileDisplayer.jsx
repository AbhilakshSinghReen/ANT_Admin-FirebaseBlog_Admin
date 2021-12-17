import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

export default function SocialNetworkProfileDisplayer({
  socialNetworkProfile,
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
      <h1>{socialNetworkProfile.networkName}</h1>
      <h3>{socialNetworkProfile.profileName}</h3>
      <a href={socialNetworkProfile.profileURL} target="_blank">
        Open
      </a>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
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
