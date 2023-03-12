import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import "xterm/dist/xterm.css";
import "./tutorial.css";
import * as fit from "xterm/lib/addons/fit/fit";
import "regenerator-runtime/runtime";
import { cmds } from "./query";
import axios from "axios";

let terminal;

const Tutorial = () => {
    //let URL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;
    const termRef = useRef();
    const targetRef = useRef();
    const [pid, setPid] = useState(sessionStorage.getItem("pid") || 0);
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
                console.log(`new pid >> ${pid}`);
                setPid(pid);
                sessionStorage.setItem("pid", pid);
                establish(pid);
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
        console.log(`pid >> ${pid}`);
        if (dimensions.width !== 0) {
            terminal = new Terminal({
                cols: dimensions.width,
                rows: dimensions.height,
                cursorBlink: true,
                rendererType: "dom",
            });

            if (pid === 0) {
                (async () => await getTerm())();
            } else {
                establish(pid);
            }
        }
    }, [dimensions.width]);

    const establish = (pid) => {
        let socket = new WebSocket(`ws://${window.location.host}/terminals/${pid}`);
        //console.log(socket.readyState);
        terminal.loadAddon(new AttachAddon(socket));
        setTermSocket(socket);
        terminal.open(termRef.current);
        setTimeout(() => {
            socket.send("clear screen\n");
        }, 500);
    };

    const runCmd = (cmd) => {
        //console.log(cmd);
        cmd.map((c, i) => {
            setTimeout(() => {
                termsocket.send(`${c}\r`);
            }, 10 * (i + 1));
        });
    };

    let href = "#";
    return (
        <div className="flex-wrapper" ref={targetRef}>
            <div
                className="item"
                style={{ height: 250, display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                width: 650,
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
            </div>
            <div ref={termRef} id="terminal-container" className="item" style={{ flex: 1 }}></div>
        </div>
    );
};

export default Tutorial;
