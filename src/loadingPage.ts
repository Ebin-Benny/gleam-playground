import * as path from "path";
import * as vscode from "vscode";

let page: string = "";

export const loadingPageHTML = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel
): string => {
  const stylePathOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "resources", "loadingStyles.css")
  );

  if (page === "") {
    const styleUri = panel.webview.asWebviewUri(stylePathOnDisk);

    page = `<!doctype html>
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  
              <title>Playground</title>
              <link rel="stylesheet" type="text/css" href="https://gleamplayground.blob.core.windows.net/playground/loadingStyles.css"/>
          </head>
          <body>
              <div class="parent">
                  <div class="lds-dual-ring"></div>
              </div>
          </body>
          </html>
      `;
  }
  return page;
};
