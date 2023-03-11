import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import "xterm/dist/xterm.css";
import "./tutorial.css";
import * as fit from "xterm/lib/addons/fit/fit";
import "regenerator-runtime/runtime";
import axios from "axios";

let terminal;

const Tutorial = ({ created, filename, execute }) => {
    //let URL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;
    const termRef = useRef();
    const targetRef = useRef();
    const [pid, setPid] = useState(sessionStorage.getItem("pid") || -1);
    const [termsocket, setTermSocket] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    //const [size, setSize] = useState({ rows: 0, cols: 0 })
    const [cols, setCols] = useState(0);
    const [rows, setRows] = useState(0);
    const [index, setIndex] = useState(10);

    const getTerm = async () => {
        Terminal.applyAddon(fit);

        await fetch(`/terminals?cols=${terminal.cols}&rows=${terminal.rows}&src=oralce`, {
            method: "POST",
        }).then((res) =>
            res.text().then(async (pid) => {
                setPid(pid);
                sessionStorage.setItem("pid", pid);
                let socket = new WebSocket(`ws://${window.location.host}/terminals/${pid}`);
                terminal.loadAddon(new AttachAddon(socket));
                setTermSocket(socket);
                await terminal.open(termRef.current);
                setTimeout(() => {
                    socket.send("clear screen\n");
                }, 1000);
            })
        );
    };

    useEffect(() => {
        //console.log(`In useEffect ${new Date().getTime()} - ${dimensions.width}`);
        if (targetRef.current) {
            setDimensions({
                width: Math.floor(termRef.current.offsetWidth / 9.1),
                height: Math.floor(termRef.current.offsetHeight / 16.7),
            });
        }
    }, []);

    useEffect(() => {
        if (dimensions.width !== 0) {
            //console.log(`Terminal creation statrs ${dimensions.width}`);
            terminal = new Terminal({
                cols: dimensions.width,
                rows: dimensions.height,
                cursorBlink: true,
                rendererType: "dom",
                // theme: {
                //     background: "#f5f5f5",
                //     foreground: "#000000",
                //     cursor: "#000000",
                // },
            });
            (async () => {
                await getTerm();
            })();
            //termsocket.send(`clear screen\n`);
        }
    }, [dimensions.width]);

    const runCmd = (cmd) => {
        //console.log(cmd);
        cmd.map((c, i) => {
            setTimeout(() => {
                termsocket.send(`${c}\r`);
            }, 10 * (i + 1));
        });
    };

    let href = "#";
    //let cmds = [`clear screen`, `SELECT * FROM tab;`, `SELECT * FROM emp;`, `LIST`, `/`];
    //let cmds = [[`clear screen`], [`SELECT * `, `FROM tab;`], [`SELECT * `, `FROM emp;`], [`LIST`], [`/`]];
    let cmds = [
        [`clear screen`],
        [`SELECT * `, `FROM tab;`],
        [`SELECT * `, `FROM countries;`],
        [`SELECT * `, `FROM departments;`],
        [`SELECT * `, `FROM employees;`],
        [`SELECT * `, `FROM emp_details_view;`],
        [`SELECT * `, `FROM jobs;`],
        [`SELECT * `, `FROM job_history;`],
        [`SELECT * `, `FROM locations;`],
        [`SELECT * `, `FROM regions;`],
        [`SELECT last_name, job_id, department_id`, `FROM employees`, `WHERE last_name = 'Whalen' ;`],
        [`LIST`],
        [`/`],
    ];
    return (
        <div className="flex-wrapper" ref={targetRef}>
            <div
                className="item"
                style={{ height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* <p>{dimensions.width}</p>
                <p>{dimensions.height}</p> */}
                {/* {cmds.map((cmd, i) => { */}
                {/* //console.log(cmd); return ( */}
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setIndex(index - 1 === -1 ? cmds.length - 1 : index - 1);
                    }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-chevron-left"
                        viewBox="0 0 16 16">
                        {" "}
                        <path
                            fillRule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                        />{" "}
                    </svg>
                </div>
                <div>
                    <a href={href} onClick={() => runCmd(cmds[index])}>
                        <pre
                            style={{
                                userSelect: "none",
                                padding: 10,
                                fontFamily: `Courier New`,
                                fontSize: "1.2rem",
                                backgroundColor: "#CCC",
                                border: `2px solid black`,
                                fontWeight: "bolder",
                                color: "black",
                                width: 600,
                                margin: "0 auto",
                            }}>
                            {cmds[index].map((c) => `${c}\n`)}
                        </pre>
                    </a>
                </div>
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setIndex(index + 1 === cmds.length ? 0 : index + 1);
                    }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16">
                        {" "}
                        <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />{" "}
                    </svg>
                </div>
                {/* ); */}
                {/* })} */}
            </div>
            <div ref={termRef} id="terminal-container" className="item" style={{ flex: 1 }}></div>
        </div>
    );
};

export default Tutorial;
/*
                                    (e, cmd) => {
                                    //termsocket.send(`${e.target.innerText}\n`);
                                    console.log(e.target.innerText, cmd);
                                    }


*/
