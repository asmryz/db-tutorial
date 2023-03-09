import React, { Fragment, useEffect } from "react";
//import ReactDOM from "react-dom";

import Container from "@material-ui/core/Container";
// import Paper from "@material-ui/core/Paper";

// import Editor from "@monaco-editor/react";
import codes from "./codes";
import IDE from "./IDE";
import "./style.css";

// const MAX_HEIGHT = 600;
// const MIN_COUNT_OF_LINES = 9;
// const LINE_HEIGHT = 20;

// monaco.config({
//     paths: {
//         vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0/min/vs"
//     }
// });

const LiveIDE = () => {
    useEffect(() => {
        const navLi = document.querySelectorAll("nav ul li a");
        const sections = document.querySelectorAll("div.sec");

        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach((div) => {
                let sectionTop = div.offsetTop;
                if (scrollY >= sectionTop - 65) {
                    current = div.getAttribute("id");
                }
            });
            navLi.forEach((li) => {
                li.classList.remove("active");
                document.querySelector(`nav ul li a[href*=${current}]`).classList.add("active");
            });
        });
    }, []);
    // const [height, setHeight] = useState(180);
    // const valueGetter = useRef();

    // const handleEditorChange = useCallback((_) => {
    //     //const countOfLines = valueGetter.current().split("\n").length;
    //     console.dir(valueGetter.current);
    //     // if (countOfLines >= MIN_COUNT_OF_LINES) {
    //     //     const currentHeight = countOfLines * LINE_HEIGHT;
    //     //     if (MAX_HEIGHT > currentHeight) {
    //     //         setHeight(currentHeight);
    //     //     }
    //     // }
    // }, []);

    // const handleEditorDidMount = useCallback(
    //     (editor, monaco) => {
    //         valueGetter.current = monaco;

    //         editor.onDidChangeModelContent(handleEditorChange);
    //         // console.dir(
    //         //     editor
    //         //         .getModel()
    //         //         .getValue()
    //         //         .split("\n").length *
    //         //         2 *
    //         //         10
    //         // );
    //         setHeight(
    //             editor
    //                 .getModel()
    //                 .getValue()
    //                 .split("\n").length *
    //                 2 *
    //                 10
    //         );
    //     },
    //     [handleEditorChange]
    // );

    //const handleHeiht = (editor) => {};
    console.log(`http://${window.location.host}`);

    return (
        <div className="box">
            <div className="content">
                <main>
                    {codes.map((item, i) => (
                        <div className="sec" id={`ide-${item.filename}`} key={i}>
                            <h4>{item.title}</h4>
                            <IDE item={item} />
                        </div>
                    ))}
                </main>
            </div>
            <div className="scroll">
                <nav>
                    <ul>
                        {codes.map((item, i) => (
                            <li key={i}>
                                <a href={`#ide-${item.filename}`} className={i === 0 ? "active" : ""}>
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default LiveIDE;
