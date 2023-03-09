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
        console.log(`In useEffect ${new Date().getTime()} - ${dimensions.width}`);
        if (targetRef.current) {
            setDimensions({
                width: Math.floor(termRef.current.offsetWidth / 9.1),
                height: Math.floor(termRef.current.offsetHeight / 16.7),
            });
        }
    }, []);

    useEffect(() => {
        if (dimensions.width !== 0) {
            console.log(`Terminal creation statrs ${dimensions.width}`);
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

    let href = "#";
    let cmds = [`clear screen`, `SELECT * FROM tab;`, `SELECT * FROM emp;`, `LIST`, `/`];
    return (
        <div className="flex-wrapper" ref={targetRef}>
            <div className="item" style={{ height: 200 }}>
                {/* <p>{dimensions.width}</p>
                <p>{dimensions.height}</p> */}
                {cmds.map((cmd, i) => (
                    <div key={i}>
                        <a
                            href={href}
                            onClick={(e) => {
                                termsocket.send(`${e.target.innerText}\n`);
                                console.log(e.target.innerText);
                            }}>
                            <pre>{cmd}</pre>
                        </a>
                    </div>
                ))}
            </div>
            <div ref={termRef} id="terminal-container" className="item" style={{ flex: 1 }}></div>
        </div>
    );
};

export default Tutorial;
