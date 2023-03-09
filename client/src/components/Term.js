import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import "xterm/dist/xterm.css";
import * as fit from "xterm/lib/addons/fit/fit";
import "regenerator-runtime/runtime";
import axios from "axios";

const Term = ({ cols, rows, created, filename, execute }) => {
    const terminal = new Terminal({
        cols,
        rows,
        cursorBlink: true,
        theme: {
            background: "#f5f5f5",
            foreground: "#000000",
            cursor: "#000000",
        },
    });
    //let URL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;
    const termRef = useRef();
    const [pid, setPid] = useState(sessionStorage.getItem("pid") || -1);
    const [termsocket, setTermSocket] = useState(null);

    const getTerm = async () => {
        Terminal.applyAddon(fit);

        await fetch(`/terminals?cols=${terminal.cols}&rows=${terminal.rows}&src=${filename}`, {
            method: "POST",
        }).then((res) =>
            res.text().then((pid) => {
                setPid(pid);
                sessionStorage.setItem("pid", pid);
                let socket = new WebSocket(`ws://${window.location.host}/terminals/${pid}`);
                //var attachAddon = new AttachAddon(socket);
                terminal.loadAddon(new AttachAddon(socket));
                setTermSocket(socket);
                terminal.open(termRef.current);
                //console.log(termRef.current.offsetWidth);
            })
        );
    };

    useEffect(() => {
        (async () => {
            await getTerm();
        })();
    }, [execute]);

    return <div ref={termRef} id="terminal-container" />;
};

export default Term;
