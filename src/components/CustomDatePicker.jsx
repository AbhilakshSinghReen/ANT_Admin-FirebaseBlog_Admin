import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker({ dateUpdated, setDateUpdated }) {
  const styles = useStyles();

  return (
    <Box
      className={styles.container}
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Typography className={styles.label} variant="h6" color="primary">
        Date updated:
      </Typography>
      <DatePicker
        selected={dateUpdated}
        onChange={(date) => setDateUpdated(date)}
        dateFormat="dd-MM-yyyy"
        showYearDropdown
        scrollableMonthYearDropdown
      />
    </Box>
  );
}

const useStyles = makeStyles({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    width: "50%",
    fontWeight: "bolder",
    margin: 15,
  },
});
