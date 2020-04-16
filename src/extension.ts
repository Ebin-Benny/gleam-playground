import * as vscode from "vscode";
import { startPlayground } from "./playground";

export const activate = (context: vscode.ExtensionContext) => {
  let playgroundCommand = vscode.commands.registerCommand(
    "gleam-playground.play",
    () => {
      startPlayground(context);
    }
  );

  let statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "gleam-playground.play";

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(playgroundCommand);

  statusBarItem.text = `$(play) Run Gleam Playground`;
  statusBarItem.show();
};

export const deactivate = () => {};
