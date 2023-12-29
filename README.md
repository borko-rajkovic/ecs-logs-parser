# ecs-logs-parser

## Features

### Command - Extract last Error details

Will go through open editor, find last Error line and extract all the details (stack trace included) to a new editor

### Command - Extract last Error's stack trace

Will go through open editor, find last Error line and extract stack trace to a new editor

## Extension Settings

This extension has the following settings:

* `ecs-logs-parser.highlightLastError`: Choose the highlighting option for the last error.
* `ecs-logs-parser.highlightChars`: Number of characters to highlight if highlightLastError is set to first-n-chars
* `ecs-logs-parser.sideBarAction`: Choose which command to be run on sidebar click

## Release Notes

### 0.0.1

Added sidebar item

### 0.0.1

Initial version
