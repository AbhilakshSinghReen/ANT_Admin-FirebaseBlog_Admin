import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

export default function Selector({
  label,
  selectedValue,
  setSelectedValue,
  allValues,
}) {
  const styles = useStyles();

  const clearButtonOnClick = () => {
    setSelectedValue("");
  };

  return (
    <div className={styles.container1}>
      <div className={styles.container2}>
        <Typography className={styles.label} variant="h6" color="primary">
          {label}
        </Typography>
        <Select
          value={selectedValue}
          onChange={(event) => setSelectedValue(event.target.value)}
        >
          {allValues.map((item, index) => (
            <MenuItem value={item.docId} key={index}>
              {item.title ? item.title : item.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      <Button
        className={styles.primaryButton}
        type="submit"
        color="secondary"
        variant="contained"
        onClick={() => clearButtonOnClick()}
      >
        Clear
      </Button>
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
