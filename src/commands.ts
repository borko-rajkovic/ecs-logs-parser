import * as vscode from "vscode";
import { getLastLineThatStartsWithAndHasWord } from "./utils/utils";

let editor: vscode.TextEditor;

export const extractLastErrorsStackTrace = async () => {
  const lastError = getLastError();

  if (!lastError) {
    return;
  }

  await selectLastError(lastError.index, editor);

  await showStackTraceInNewEditor(lastError.line);
};

export const extractLastError = async () => {
  const lastError = getLastError();

  if (!lastError) {
    return;
  }

  await selectLastError(lastError.index, editor);

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
  const newEditor = await vscode.workspace.openTextDocument({
    content: JSON.parse(lastError)["error.stack_trace"],
  });

  await vscode.window.showTextDocument(newEditor);
};

const selectLastError = async (
  lastErrorLineIndex: number,
  editor: vscode.TextEditor
) => {
  await vscode.commands.executeCommand("revealLine", {
    lineNumber: lastErrorLineIndex,
    at: "center",
  });

  const startPosition = new vscode.Position(lastErrorLineIndex, 0);
  const endPosition = new vscode.Position(lastErrorLineIndex, 60);
  const selection = new vscode.Selection(startPosition, endPosition);
  editor.selection = selection;
};

const showErrorDetailsInNewEditor = async (lastError: string) => {
  const parsedLastError = JSON.parse(lastError);
  const stackTrace = parsedLastError["error.stack_trace"];
  parsedLastError["error.stack_trace"] = "<Check bellow>";
  lastError = JSON.stringify(parsedLastError, null, 2);

  const newEditor = await vscode.workspace.openTextDocument({
    content: lastError + "\n\nStack trace:\n\n" + stackTrace,
  });

  await vscode.window.showTextDocument(newEditor);
};
