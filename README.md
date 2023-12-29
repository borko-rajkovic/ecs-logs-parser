# ecs-logs-parser

## Features

### Command - Extract the last Error details

Will go through the open editor, find the last Error line and extract all the details (stack trace included) to a new editor

### Command - Extract the last Error's stack trace

Will go through open editor, find last Error line and extract stack trace to a new editor

## Extension Settings

This extension has the following settings:

* `ecs-logs-parser.highlightLastError`: Choose the highlighting option for the last error.
* `ecs-logs-parser.highlightChars`: Number of characters to highlight if highlightLastError is set to first-n-chars
* `ecs-logs-parser.sideBarAction`: Choose which command to run on the sidebar click
* `ecs-logs-parser.exportToSide`: Choose whether to open a new editor to a separate group next to the current one

## Release Notes

### 0.0.5

- Lower down vscode engine requirements

### 0.0.4

- Fix bug for extracting only stack trace

### 0.0.3

- Added configuration to show new editor with result to side of the current editor
- The language of the exported result is set to `Java`
- Fix some typos

### 0.0.2

- Added sidebar item
- Configuration for the action of the sidebar item

### 0.0.1

- Initial version with 2 commands from the command palette
- Configurations for the highlighting of the found error
