import * as os from "os";
import * as vscode from "vscode";

export const playgroundUri = (context: vscode.ExtensionContext): vscode.Uri => {
  let uri: vscode.Uri;

  switch (os.platform()) {
    case "win32":
      uri = vscode.Uri.parse(
        `file:${context.extensionPath}\\.playground\\playground${vscode.workspace.name}\\playground.hs`
      );
      break;
    default:
      uri = vscode.Uri.parse(
        `file://${context.extensionPath}/.playground/playground${vscode.workspace.name}/playground.hs`
      );
  }

  return uri;
};

export const isPlaygroundFile = (
  context: vscode.ExtensionContext,
  fileName: string
): boolean => {
  let isPlaygroundFile = false;

  switch (os.platform()) {
    case "win32":
      isPlaygroundFile =
        fileName ===
        `${context.extensionPath}\\.playground\\playground${vscode.workspace.name}\\playground.hs`;
      break;
    default:
      isPlaygroundFile =
        fileName ===
        `${context.extensionPath}/.playground/playground${vscode.workspace.name}/playground.hs`;
  }

  return isPlaygroundFile;
};
