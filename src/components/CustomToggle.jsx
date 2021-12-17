import Switch from "react-switch";

import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

export default function CustomToggle({ label, isSelected, setIsSelected }) {
  const styles = useStyles();

  return (
    <div className={styles.container2}>
      <Typography className={styles.label} variant="h6" color="primary">
        {label}
      </Typography>
      <Switch onChange={setIsSelected} checked={isSelected} />
    </div>
  );
}

const useStyles = makeStyles({
  container1: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  container2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    fontWeight: "bolder",
    margin: 15,
  },
});
