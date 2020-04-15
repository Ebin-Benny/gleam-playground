import * as path from "path";
import * as vscode from "vscode";
import { sleep } from "./utility";
import { playgroundUri, isPlaygroundFile } from "./paths";
import { loadingPageHTML } from "./loadingPage";
import { playgroundPageHTML } from "./playgroundPage";
import { runExpressions, run, rerunExpressions, rerun } from "./commands";
import { platform } from "os";

export const startPlayground = async (context: vscode.ExtensionContext) => {
  const terminal = vscode.window.createTerminal("playground");
  const panel = vscode.window.createWebviewPanel(
    "playground",
    "Playground",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "resources")),
      ],
    }
  );

  terminal.sendText("cabal repl");
  await sleep(1000);

  const uri = playgroundUri(context);
  const loadingPage = await loadingPageHTML(context, panel);

  /// Playground startup

  vscode.workspace.openTextDocument().then(
    async (doc) => {
      panel.webview.html = loadingPage;
      vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Active,
      });
      await runExpressions(context, terminal, doc, panel);
    },
    (err) => {
      vscode.workspace.openTextDocument(uri).then(
        async (doc) => {
          vscode.window.showTextDocument(doc, {
            viewColumn: vscode.ViewColumn.Active,
          });
          await run(context, terminal, panel);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  );

  /// Files saved

  vscode.workspace.onDidSaveTextDocument(async (doc) => {
    if (isPlaygroundFile(context, doc.fileName)) {
      await rerunExpressions(context, terminal, doc, panel);
    } else {
      vscode.workspace.openTextDocument(uri).then(
        async (doc) => {
          await rerun(context, terminal, panel);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  });
};
