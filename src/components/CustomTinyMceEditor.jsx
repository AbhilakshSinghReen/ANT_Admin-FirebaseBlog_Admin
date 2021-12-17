import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCE_API_Key = "r2ipvrhf1epfeeoxyiorfg50d8f6zxuddrmi96lyjt6zgmf3";

export default function CustomTinyMceEditor({ content, updateContent }) {
  const editorRef = useRef(null);

  return (
    <div style={{ width: "100%", marginBottom: 20 }}>
      <Editor
        apiKey={TinyMCE_API_Key}
        onInit={(evt, editor) => (editorRef.current = editor)}
        file_picker_types="image media"
        //initialValue="<p>Type right here...</p>"
        value={content}
        onEditorChange={(newValue, editor) => updateContent(newValue)}
        init={{
          height: "70vh",
          width: "100%",
          cleanup_on_startup: true,
          custom_undo_redo_levels: 20,
          selector: "textarea",
          plugins: `
              textcolor save link image media preview codesample contextmenu
              table code lists fullscreen  insertdatetime  nonbreaking
              contextmenu directionality searchreplace wordcount visualblocks
              visualchars code fullscreen autolink lists  charmap print  hr
              anchor pagebreak
              `,
          toolbar1: `              
              fullscreen preview | fontselect formatselect bold italic underline superscript subscript | fontselect,
              fontsizeselect  | forecolor backcolor | alignleft alignright |
              aligncenter alignjustify | indent outdent | bullist numlist table |
              | link image media | codesample |
              `,
          toolbar2: `
              visualblocks visualchars |
              charmap hr pagebreak nonbreaking anchor |  code |
              `,
          contextmenu: "formats | link image",
          menubar: "true",
          statusbar: "true",
        }}
      />
    </div>
  );
}
