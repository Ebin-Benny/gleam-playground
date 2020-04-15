import * as vscode from "vscode";
import { sleep } from "./utility";
import { playgroundPageHTML } from "./playgroundPage";

export const runExpressions = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  doc: vscode.TextDocument,
  panel: vscode.WebviewPanel
) => {
  let playStatements = [];
  const playgroundPage = await playgroundPageHTML(context, panel);

  terminal.sendText(":{");

  for (let i = 0; i < doc.lineCount; i++) {
    const textLine = doc.lineAt(i);
    if (!textLine.isEmptyOrWhitespace) {
      if (
        textLine.firstNonWhitespaceCharacterIndex === 0 &&
        textLine.text.startsWith("play ")
      ) {
        playStatements.push(
          `(Simulation  ${textLine.text.substring(5)} "${
            textLine.lineNumber
          }: ${textLine.text}")`
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
  await sleep(1500);
  panel.webview.html = playgroundPage;
};

export const rerunExpressions = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  doc: vscode.TextDocument,
  panel: vscode.WebviewPanel
) => {
  terminal.sendText("\u0003", false);
  await runExpressions(context, terminal, doc, panel);
};

export const run = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  panel: vscode.WebviewPanel
) => {
  const playgroundPage = await playgroundPageHTML(context, panel);
  terminal.sendText("main");
  await sleep(1500);
  panel.webview.html = playgroundPage;
};

export const rerun = async (
  context: vscode.ExtensionContext,
  terminal: vscode.Terminal,
  panel: vscode.WebviewPanel
) => {
  terminal.sendText("\u0003", false);
  await run(context, terminal, panel);
};
