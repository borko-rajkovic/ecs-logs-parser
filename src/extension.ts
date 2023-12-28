import * as vscode from "vscode";
import { extractLastErrorsStackTrace, extractLastError } from "./commands";

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
}

export function deactivate() {}
