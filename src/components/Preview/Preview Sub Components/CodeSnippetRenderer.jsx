import { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import SyntaxHighlighter from "react-syntax-highlighter";
import darkTheme from "react-syntax-highlighter/dist/cjs/styles/prism/vs-dark";

export default function CodeSnippetRenderer({ language, codeString }) {
  const styles = useStyles();

  const [copyButtonLabel, setCopyButtonLabel] = useState("Copy");

  const resetCopyButtonLabelAfter5Seconds = () => {
    setTimeout(() => {
      setCopyButtonLabel("Copy");
    }, 5000);
  };

  const copyButtonOnClick = () => {
    navigator.clipboard
      .writeText(codeString)
      .then(() => {
        setCopyButtonLabel("Copied");
        resetCopyButtonLabelAfter5Seconds();
      })
      .catch(() => {
        setCopyButtonLabel("Error");
        resetCopyButtonLabelAfter5Seconds();
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button onClick={() => copyButtonOnClick()}>{copyButtonLabel}</Button>
      </div>

      <SyntaxHighlighter wrapLongLines language={language} sytle={darkTheme}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    border: "1px solid",
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
