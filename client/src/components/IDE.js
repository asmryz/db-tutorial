import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Term from "./Term";
import { Paper } from "@material-ui/core";
import axios from "axios";

//const rTabs = (str) => str.trim().replace(/^ {4}/gm, "");

const IDE = ({ item }) => {
    const editorRef = useRef(null);
    const [execute, setExecute] = useState(0);

    // const item = {
    //     filename: "src-1",
    //     extention: ".c",
    //     language: "c",
    //     code: `
    // #include<stdio.h>

    // int main()
    // {
    //     int i;
    //     for(i=0; i<=5; i++)
    //     {
    //             printf("%d\\n", i);
    //     }
    //     return 0;
    // }`,
    // };

    function handleEditorDidMount(editor, monaco) {
        editor.getModel().updateOptions({ tabSize: 4 });
        editor.getAction("editor.action.formatDocument").run();
        editorRef.current = editor;
    }

    function showValue() {
        console.log(editorRef.current.getValue());
        setExecute(0);
        axios
            .post("/save", {
                src: editorRef.current.getValue(),
                extention: item.extention,
                filename: item.filename,
            })
            .then((res) => {
                if (res.data === "saved") {
                    setExecute(1);
                }
            });
    }

    //console.log(`height >> ${item.code.split("\n").length * 2 * 10}`);
    return (
        <Paper>
            <button type="button" onClick={showValue}>
                compile
            </button>
            <Editor
                //height={item.code.split("\n").length * 2 * 10 < 300 ? item.code.split("\n").length * 2 * 10 : 300}
                height={300}
                onMount={handleEditorDidMount}
                language={item.language}
                value={item.code}
                scrollBeyondLastLine="false"
                options={{
                    readOnly: false,
                    minimap: { enabled: false },
                    scrollbars: false,
                }}
            />
            output:
            <div style={{ width: 1162, height: 200, backgroundColor: "#f5f5f5" }}>
                {execute !== 0 ? <Term cols={130} rows={12} filename={item.filename} execute={execute} /> : null}
            </div>
        </Paper>
    );
};
export default IDE;
