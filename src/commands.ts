import * as vscode from "vscode";
import { getLastLineThatStartsWithAndHasWord } from "./utils/utils";

let editor: vscode.TextEditor;

export const sidebarButtonAction = async () => {
  let config = vscode.workspace.getConfiguration("ecs-logs-parser");
  let sideBarAction = config.get("sideBarAction");

  if (sideBarAction === "extractLastError") {
    await extractLastError();
  } else {
    await extractLastErrorsStackTrace();
  }
};

export const updateStatusBarItem = (
  lastErrorStatusBarItem: vscode.StatusBarItem
) => {
  if (vscode.window.activeTextEditor) {
    lastErrorStatusBarItem.show();
  } else {
    lastErrorStatusBarItem.hide();
  }
};

export const extractLastErrorsStackTrace = async () => {
  const lastError = getLastError();

  if (!lastError) {
    return;
  }

  await selectLastError(lastError, editor);

  await showStackTraceInNewEditor(lastError.line);
};

export const extractLastError = async () => {
  const lastError = getLastError();

  if (!lastError) {
    return;
  }

  await selectLastError(lastError, editor);

  await showErrorDetailsInNewEditor(lastError.line);
};

const getOpenedEditor = () => {
  editor = vscode.window.activeTextEditor!;
  return editor;
};

const getLastError = () => {
  if (!getOpenedEditor()) {
    vscode.window.showWarningMessage("Please open editor");
    return;
  }

  const text = editor.document.getText();

  const lastError = getLastLineThatStartsWithAndHasWord(
    text,
    `{"@timestamp":`,
    `log.level":"ERROR"`
  );

  if (!lastError) {
    vscode.window.showInformationMessage("No errors found");
    return;
  }

  return lastError;
};

const showStackTraceInNewEditor = async (lastError: string) => {
  const content = JSON.parse(lastError)["error.stack_trace"];

  await displayInNewEditor(content);
};

const selectLastError = async (
  lastError: {
    line: string;
    index: number;
  },
  editor: vscode.TextEditor
) => {
  const lastErrorLineIndex = lastError.index;
  await vscode.commands.executeCommand("revealLine", {
    lineNumber: lastErrorLineIndex,
    at: "center",
  });

  let config = vscode.workspace.getConfiguration("ecs-logs-parser");
  let highlightOption = config.get("highlightLastError");

  switch (highlightOption) {
    case "none":
      return;
    case "first-n-chars":
      {
        let highlightChars = config.get<number>("highlightChars");

        if (!highlightChars) {
          vscode.window.showErrorMessage(
            "Please configure ecs-logs-parser.highlightChars in settings.json"
          );
          return;
        }

        const startPosition = new vscode.Position(lastErrorLineIndex, 0);
        const endPosition = new vscode.Position(
          lastErrorLineIndex,
          highlightChars
        );
        const selection = new vscode.Selection(startPosition, endPosition);
        editor.selection = selection;
      }
      break;
    case "line":
      {
        const startPosition = new vscode.Position(lastErrorLineIndex, 0);
        const endPosition = new vscode.Position(
          lastErrorLineIndex,
          lastError.line.length
        );
        const selection = new vscode.Selection(startPosition, endPosition);
        editor.selection = selection;
      }
      break;
    default:
      return;
  }
};

const showErrorDetailsInNewEditor = async (lastError: string) => {
  const parsedLastError = JSON.parse(lastError);
  const stackTrace = parsedLastError["error.stack_trace"];
  parsedLastError["error.stack_trace"] = "<Check bellow>";
  lastError = JSON.stringify(parsedLastError, null, 2);
  const content = lastError + "\n\nStack trace:\n\n" + stackTrace;

  await displayInNewEditor(content);
};

const displayInNewEditor = async (content: string) => {
  const newEditor = await vscode.workspace.openTextDocument({
    content,
    language: "java",
  });

  let config = vscode.workspace.getConfiguration("ecs-logs-parser");
  let exportToSide = config.get("exportToSide");

  const viewColumn = exportToSide
    ? vscode.ViewColumn.Beside
    : vscode.ViewColumn.Active;

  await vscode.window.showTextDocument(newEditor, {
    viewColumn,
  });
};
