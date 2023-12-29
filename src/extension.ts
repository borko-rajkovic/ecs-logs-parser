import * as vscode from "vscode";
import {
  extractLastErrorsStackTrace,
  extractLastError,
  sidebarButtonAction,
  updateStatusBarItem,
} from "./commands";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "ecs-logs-parser.extractLastErrorsStackTrace",
      extractLastErrorsStackTrace
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "ecs-logs-parser.extractLastError",
      extractLastError
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "ecs-logs-parser.sidebarButtonAction",
      sidebarButtonAction
    )
  );

  const lastErrorStatusBarItem = createErrorStatusBarItem();

  context.subscriptions.push(lastErrorStatusBarItem);

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() =>
      updateStatusBarItem(lastErrorStatusBarItem)
    )
  );

  updateStatusBarItem(lastErrorStatusBarItem);
}

function createErrorStatusBarItem() {
  const lastErrorStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  lastErrorStatusBarItem.command = "ecs-logs-parser.sidebarButtonAction";
  lastErrorStatusBarItem.text = `$(note) ECS logs parser`;
  return lastErrorStatusBarItem;
}

export function deactivate() {}
