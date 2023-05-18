// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

require("dotenv").config();
const { spawn } = require("child_process");

const privateKeyPath = ".ssh/private_key";
const keyPathFlag = "-i";
const verboseFlag = "-v";
const noRemoteCmdFlag = "-N";
const remoteServer = process.env.REMOTE_SERVER;
const localPortForwardingFlag = "-L";
const localServerPort = process.env.LOCAL_SERVER_PORT || "5000";
const forwardingServer = process.env.FORWARDING_SERVER;

const sshCommand = "ssh";
const sshArgs = [
  keyPathFlag,
  privateKeyPath,
  verboseFlag,
  noRemoteCmdFlag,
  remoteServer,
  localPortForwardingFlag,
  `${localServerPort}:${forwardingServer}`,
];

console.log(`spawning ssh tunnel: ${sshCommand} ${sshArgs}`);
const sshProcess = spawn(sshCommand, sshArgs);

sshProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

sshProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

sshProcess.on("close", (code) => {
  console.log(`SSH process exited with code ${code}`);
});

sshProcess.on("error", (error) => {
  console.error(`Error executing SSH command: ${error.message}`);
});
