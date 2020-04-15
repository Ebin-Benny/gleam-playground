import * as vscode from "vscode";
import { startPlayground } from "./playground";

export const activate = (context: vscode.ExtensionContext) => {
  let playgroundCommand = vscode.commands.registerCommand(
    "gleamplayground.play",
    () => {
      startPlayground(context);
    }
  );

  context.subscriptions.push(playgroundCommand);
};

export const deactivate = () => {};
