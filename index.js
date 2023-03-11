"use strict";
exports.__esModule = true;
const fs = require("fs");
var pty = require("node-pty");

require("dotenv").config();
const dev = process.env.NODE_ENV !== "production";
const path = require("path");
const express = require("express");
const app = express();
var expressWs = require("express-ws")(app);
app.use(express.static(path.join(__dirname, "client", "dist")));
app.use(express.json());

var terminals = {};
var args = [];
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (dev) {
    const webpackDev = require("./dev");
    app.use(webpackDev.comp).use(webpackDev.hot);
}

app.get("/msg", (req, res) => {
    res.json({ msg: `Hello World` });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Instantiate shell and set up data handlers
expressWs.app.ws("/terminals/:pid", function (ws, req) {
    var term = terminals[parseInt(req.params.pid)];

    term.on("data", function (data) {
        ws.send(data);
    });
    // For all websocket data send it to the shell
    ws.on("message", function (msg) {
        term.write(msg);
    });
    ws.on("close", function () {
        term.kill();
        console.log("Closed terminal " + term.pid);
        // Clean things up
        delete terminals[term.pid];
    });
});

app.post("/save", (req, res) => {
    //console.log(`first`);
    //console.log(req.body);
    const outputPath = "/home/asimriaz/git/C/";
    const { src, extention, filename } = req.body;
    // code that generates names and content

    const currentFile = `${outputPath}${filename}${extention}`;
    //const content = "...";
    fs.promises.writeFile(currentFile, src, "utf8");
    res.send("saved");
});

//docker run -itd --rm --name c-compiler gcc /bin/bash
//docker run --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp openjdk:11 javac HelloWorld.java && java HelloWorld
app.post("/terminals", async function (req, res) {
    //console.log(`query >> ${JSON.stringify(req.query, null, ' ')}`)
    // args = [
    //     "run",
    //     "--rm",
    //     "-it",
    //     "-v",
    //     "/home/asimriaz/git/C:/usr/src/myapp",
    //     "-w",
    //     "/usr/src/myapp",
    //     "gcc:4.9",
    //     "bash",
    //     "-c",
    //     //`gcc -o second second.c && ./second`,
    //     `gcc -o ${req.query.src} ${req.query.src}.c && ./${req.query.src}`,
    // ];
    args = [
        "exec",
        "-it",
        "oracle-11.2.0.2",
        "bash",
        "-c",
        `export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe && /u01/app/oracle/product/11.2.0/xe/bin/sqlplus hr/hr@localhost`,
    ];
    var cols = parseInt(req.query.cols);
    var rows = parseInt(req.query.rows);

    let options = {
        name: "xterm-color",
        cols: cols || 80,
        rows: rows || 24,
        cwd: process.env.PWD,
        env: process.env,
    };

    var term = req.query.src === "undefined" ? pty.spawn("bash", [], options) : pty.spawn("docker", args, options);
    //term.write("ls\r");
    console.log("Created terminal with PID: " + term.pid);
    // console.log(
    //     `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`
    // );
    terminals[term.pid] = term;

    res.send(term.pid.toString());
    res.end();
});

app.post("/terminals/:pid/size", function (req, res) {
    var pid = parseInt(req.params.pid),
        cols = parseInt(req.query.cols),
        rows = parseInt(req.query.rows),
        term = terminals[pid];

    //term.resize(cols, rows);
    //term.write("ls\r");
    console.log("Resized terminal " + pid + " to " + cols + " cols and " + rows + " rows.");
    res.status(200).send(pid);
    res.end();
});

app.listen(4283, function () {
    console.log("Server started on :4283");
});
