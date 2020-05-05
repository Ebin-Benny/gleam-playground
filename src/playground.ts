import * as path from "path";
import * as vscode from "vscode";
import * as util from "util";
import { exec as e } from "child_process";
import {
  playgroundFileUri,
  playgroundUntitledUri,
  isPlaygroundFile,
} from "./paths";
import { loadingPageHTML } from "./loadingPage";
import {
  runInitialExpressions,
  runInitial,
  rerunExpressions,
  rerun,
} from "./commands";

const exec = util.promisify(e);

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

  const loadingPage = loadingPageHTML(context, panel);
  panel.webview.html = loadingPage;

  await exec("cabal build", { cwd: vscode.workspace.rootPath });

  /// Playground startup
  vscode.workspace.openTextDocument(playgroundFileUri(context)).then(
    async (doc) => {
      vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.One,
      });
      await runInitialExpressions(context, terminal, doc, panel);
    },
    (err) => {
      vscode.workspace.openTextDocument(playgroundUntitledUri(context)).then(
        async (doc) => {
          vscode.window.showTextDocument(doc, {
            viewColumn: vscode.ViewColumn.One,
          });
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
      vscode.workspace.openTextDocument(playgroundFileUri(context)).then(
        async (doc) => {
          await rerun(context, terminal, panel);
        },
        (err) => {
          vscode.workspace
            .openTextDocument(playgroundUntitledUri(context))
            .then(
              async (doc) => {
                await rerun(context, terminal, panel);
              },
              (err) => {
                console.log(err);
              }
            );
        }
      );
    }
  });
};
