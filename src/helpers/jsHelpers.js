function isObject(object) {
  return object != null && typeof object === "object";
}

export function objectDeepEqual(object1, object2) {
  if (object1 === null) {
    return object2 === null;
  }
  if (object2 === null) {
    return object1 === null;
  }

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !objectDeepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

export function isStringNonNegativeInteger(value) {
  const intValue = parseFloat(parseInt(value));
  const floatValue = parseFloat(value);

  return intValue === floatValue && intValue >= 0;
}

export function moveItemToNewIndex(arr, oldIndex, newIndex) {
  console.log("Array = ", arr);

  if (newIndex < 0 || oldIndex >= arr.length) {
    return arr;
  }

  var element = arr[oldIndex];

  let newArr = arr.splice(oldIndex, 1);
  newArr = newArr.splice(newIndex, 0, element);

  return newArr;
}

export function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

/*
const tagsToBeIndexed = ["h1", "h2", "h3", "h4", "h5", "h6"];

function getContentAndLevelOf_H_Tag(hTagHtml) {}

export function parseHtmlToGenerateIndexAndAnchorTags() {
  const index = [];

  /*
  Just starting with 1 to make things easy
  Levels:-
  H1: level 1
  and so on
  Level will determine the hierarchical position in the markup tree  
  

  let isParsing = true;

  let newHtmlString = "";
  let unProcessedHtmlString = htmlString;

  let outputHtmlString = "";

  let counter = 0;

  let fullString = htmlString;
  let lastProcessedIndex = 0;
  //while (lastProcessedIndex !== htmlString.length) {
  while (counter < 12) {
    counter += 1;

    let stringToBeProcessed = fullString.slice(
      lastProcessedIndex,
      fullString.length
    );

    let index1 = stringToBeProcessed.indexOf("<h");
    let index2 = stringToBeProcessed.indexOf(">");

    let tagTypeString = stringToBeProcessed.slice(index1, index2 + 1);
    tagTypeString = tagTypeString.replace("<", "");
    tagTypeString = tagTypeString.replace(">", "");

    let closingTagString = `</${tagTypeString}>`;
    let index3 = stringToBeProcessed.indexOf(closingTagString);
    let index4 = index3 + closingTagString.length;

    console.log("Just processed: ", tagTypeString, " tag");
    console.log("Processed: ", lastProcessedIndex);
    console.log("To be processed: ", stringToBeProcessed);

    if (tagsToBeIndexed.includes(tagTypeString)) {
      const tagContentsOnly = stringToBeProcessed.slice(index2 + 1, index3);

      let level = parseInt(tagTypeString[1]) - 1;
      let name = tagContentsOnly.replace(" ", "-");

           
      let nameAttributeString = ` name="${name}"`;

      let tempNewHtmlString = stringToBeProcessed;

      outputHtmlString +=
        tempNewHtmlString.slice(0, index2) +
        nameAttributeString +
        tempNewHtmlString.slice(index2, index4);
       

      index.push({
        level: level,
        content: tagContentsOnly,
        name: name,
      });
    } else {
      //lastProcessedIndex = index2 + 1;
    }

    lastProcessedIndex = index4;
  }

  console.log("Index: ", index);
}

const html2 = `<h1>`;

const htmlString = `
<h1>Heading 1</h1>
<h2>Sub Heading 1</h2>
<p>Content 1</p>
<h2>Sub Heading 2</h2>
<h3>Sub Sub heading 1</h3>
<p>Content 2</p>
<h1>Heading 2</h1>
<h2>Sub Heading 3</h2>
<h3>Sub Sub heading 3</h3>
<p>Content 3</p>
<h2>Sub Heading 4</h2>
<h3>Sub Sub heading 4</h3>
<p>Content 4</p>
<h1>Heading 3</h1>
<h2>Sub Heading 5</h2>
<h3>Sub Sub heading 5</h3>
<p>Content 5</p>
<h3>Sub Sub heading 6</h3>
<p>Content 6</p>
<h2>Sub Heading 6</h2>
<h3>Sub Sub heading 7</h3>
<p>Content 7</p>
`;
*/
