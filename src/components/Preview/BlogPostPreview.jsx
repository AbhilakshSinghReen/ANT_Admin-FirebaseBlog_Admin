import { Fragment, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import ReactHtmlParser from "react-html-parser";

import Navigation from "./Preview Sub Components/Navigation";
import ContentsRenderer from "./Preview Sub Components/ContentsRenderer";
import CodeSnippetRenderer from "./Preview Sub Components/CodeSnippetRenderer";
import ConnectRenderer from "./Preview Sub Components/ConnectRenderer";

//import { baseURL } from "../../../../../lib/constants";

const useStyles = makeStyles((theme) => ({
  mainContent: {
    boxShadow: theme.shadows[10],
    backgroundColor: theme.palette.type === "light" ? "#ffffff" : "#000000",
    paddingLeft: 15,
    paddingTop: 15,
  },
  thumbnailImageContainer: {
    width: "100%",
  },
}));

export default function BlogPostPreview({ data }) {
  const styles = useStyles();

  const transformFunction = (node) => {
    if (node?.parent?.type === "tag" && node?.parent?.name === "pre") {
      let codeString = ``;
      const language = node.parent.attribs.class.replace("language-", "");

      node.children.forEach((childTag) => {
        if (childTag.parent.name === "code") {
          codeString += `${childTag.data}`;
        }
      });

      return (
        <CodeSnippetRenderer language={language} codeString={codeString} />
      );
    }
  };

  if (!data) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Fragment>
      <Navigation
        pageHierarchyList={[
          {
            link: "/blog",
            title: "Blog",
          },
          {
            link: `/blog/${data.blogCategorySlug}`,
            title: data.blogCategoryTitle,
          },
          {
            link: `/blog/${data.blogCategorySlug}/${data.blogSubcategorySlug}`,
            title: data.blogSubcategoryTitle,
          },
          {
            link: `/blog/${data.blogCategorySlug}/${data.blogSubcategorySlug}/${data.slug}`,
            title: data.title,
          },
        ]}
      />
      <br />
      <br />
      <Grid style={{ padding: "25px" }} container spacing={8}>
        {/*
        <Grid
          item
          xs={12}
          sm={2}
          style={{ maxHeight: "100vh", overflow: "auto" }}
        >
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
        </Grid>
        */}
        <Grid
          item
          className={styles.mainContent}
          xs={12}
          //sm={8}
        >
          <article>
            <Typography variant="h3" component="h1">
              {data.title}
            </Typography>
            {/*<p>{data.dateUpdated}</p>*/}
            <p>{data.summary}</p>
            <hr />

            <div
              className={styles.thumbnailImageContainer}
              dangerouslySetInnerHTML={{
                __html: `<img src="${data.thumbnailImage}" alt="${data.title} thumbnail image." style="max-width: 100%; max-height: 50vh;" />`,
              }}
            ></div>
            <br />
            <br />
            <ContentsRenderer contents={data.index} />
            <ConnectRenderer />
            <div>
              {ReactHtmlParser(data.content, { transform: transformFunction })}
            </div>
          </article>
        </Grid>
        {/*
        <Grid item xs={12} sm={4}>
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
          <h1>This is an Ad</h1>
        </Grid>
        */}
      </Grid>
      <br />
      <br />
      <br />
    </Fragment>
  );
}
