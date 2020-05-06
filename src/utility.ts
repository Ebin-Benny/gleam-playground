import * as vscode from "vscode";

let checkedForFile = false;
let stack = false;

export const isStackProject = async (): Promise<boolean> => {
  if (!checkedForFile) {
    const files = await vscode.workspace.findFiles("stack.yaml");
    checkedForFile = true;
    if (files.length > 0) {
      stack = true;
    }
  }
  return stack;
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
