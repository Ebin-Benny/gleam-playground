import * as vscode from "vscode";
import * as os from "os";

import { sleep } from "./utility";
import { playgroundPageHTML } from "./playgroundPage";

const runExpressions = async (
  terminal: vscode.Terminal,
  doc: vscode.TextDocument
) => {
  let playStatements = [];

  terminal.sendText(":{");

  for (let i = 0; i < doc.lineCount; i++) {
    const textLine = doc.lineAt(i);
    if (!textLine.isEmptyOrWhitespace) {
      if (
        textLine.firstNonWhitespaceCharacterIndex === 0 &&
        textLine.text.startsWith("play ")
      ) {
        playStatements.push(
          `(Simulation ${textLine.text.substring(5)} "${textLine.lineNumber}: ${
            textLine.text
          }")`
        );
      } else {
        terminal.sendText(textLine.text);
      }
    }
  }

  if (playStatements.length !== 0) {
    let statement = "main = playMultiple [" + playStatements.join(",") + "]";
    terminal.sendText(statement);
  }

  terminal.sendText(":}");
  terminal.sendText("main");
};

export const runInitialExpressions = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  doc: vscode.TextDocument,
  panel: vscode.WebviewPanel
) => {
  terminal.show();

  terminal.sendText("cabal repl");
  await sleep(1000);

  const playgroundPage = playgroundPageHTML(context, panel);

  await runExpressions(terminal, doc);

  await sleep(1500);
  panel.webview.html = playgroundPage;
};

export const rerunExpressions = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  doc: vscode.TextDocument,
  panel: vscode.WebviewPanel
) => {
  await reload(terminal);

  await runExpressions(terminal, doc);
};

const run = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  panel: vscode.WebviewPanel
) => {
  const playgroundPage = playgroundPageHTML(context, panel);
  terminal.sendText("main");
  await sleep(1500);
  panel.webview.html = playgroundPage;
};

export const runInitial = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  panel: vscode.WebviewPanel
) => {
  terminal.show();

  terminal.sendText("cabal repl");
  await sleep(1000);

  const playgroundPage = playgroundPageHTML(context, panel);

  await run(context, terminal, panel);

  await sleep(1500);
  panel.webview.html = playgroundPage;
};

export const rerun = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  panel: vscode.WebviewPanel
) => {
  await reload(terminal);

  await run(context, terminal, panel);
};

const reload = async (terminal: vscode.Terminal) => {
  switch (os.platform()) {
    case "win32":
      terminal.sendText("\u0003", false);
      terminal.sendText("\u0003", false);
      terminal.sendText(":quit");
      await sleep(500);
      terminal.sendText("cabal repl");
      await sleep(1000);
      break;
    default:
      terminal.sendText("\u0003", false);
      terminal.sendText(":reload");
  }
};
