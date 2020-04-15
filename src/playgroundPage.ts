import * as path from "path";
import * as vscode from "vscode";

let page: string = "";

export const playgroundPageHTML = async (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel
): Promise<string> => {
  if (page !== "") {
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(context.extensionPath, "resources", "haskell.js")
    );

    const stylePathOnDisk = vscode.Uri.file(
      path.join(context.extensionPath, "resources", "styles.css")
    );

    const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);
    const styleUri = panel.webview.asWebviewUri(stylePathOnDisk);

    page = `<!doctype html>
        	<head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          
              <title>Playground</title>
              <link rel="stylesheet" type="text/css" href="${styleUri.toString()}"/>
          
              <!-- See https://stackoverflow.com/a/37480521  -->
              <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>
              <script src="${scriptUri.toString()}"></script>
              <script>if (window.module) module = window.module;</script>
          
              <script type="text/javascript" charset="utf-8">
                  Haskell.initFFI();
              </script>
          </head>
          <body>
              <noscript>Please enable JavaScript.</noscript>
          </body>
          </html>
          `;
  }
  return page;
};
