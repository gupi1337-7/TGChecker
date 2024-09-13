# Telegram Parser Extension

![TG Checker Logo](Images/myicon.png)

## 🌟 Overview

Telegram Parser Extension is a Chrome extension designed to automate message parsing and responses in Telegram Web. It's particularly useful for identifying and responding to messages containing specific information like phone numbers or email addresses.

## 🚀 Features

- Automatically opens Telegram Web in a new tab
- Parses incoming messages in a specified chat
- Detects phone numbers and email addresses in messages
- Responds with a "+" to messages meeting certain criteria
- Limits the number of automatic responses
- Provides start/stop functionality

## 🛠️ Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the folder containing the extension files.

## ⚙️ Configuration

Before using the extension, you need to configure a few things:

1. In the `checkSite()` function, replace `CHAT_ID_TO_WORK_WITH` with the actual chat ID you want to monitor.
2. Adjust the `messageLimit` variable to set the maximum number of automatic responses.

## 📜 Usage

1. Click on the extension icon to open the popup.
2. Set the desired message limit.
3. Click "Start" to begin the parsing process.
4. The extension will open Telegram Web and start monitoring the specified chat.
5. When a message containing a phone number or email is detected, it will automatically respond with a "+".
6. The extension will stop automatically after reaching the message limit or when you click "Stop".

## 🔒 Permissions

This extension requires the following permissions:

- `storage`: To store and retrieve the execution count and script status.
- `tabs`: To create and manage the Telegram Web tab.
- `scripting`: To inject and execute scripts in the Telegram Web page.
- `alarms`: To schedule periodic checks of messages.

## 🔄 How it works

1. The extension creates a new tab with Telegram Web.
2. It periodically checks for new messages in the specified chat.
3. Each message is analyzed for the presence of:
   - At least 6 lines of text
   - A phone number (6 or more consecutive digits)
   - An email address (contains '@' symbol)
   - Proper number of empty lines
4. If a message meets the criteria, the extension sends a "+" as a response.
5. The process continues until the message limit is reached or the user stops the extension.

## ⚠️ Disclaimer

This extension is for educational and personal use only. Be sure to comply with Telegram's terms of service and respect others' privacy when using this tool.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/yourusername/telegram-parser-extension/issues) if you want to contribute.
Please read our [contribution guidelines](CONTRIBUTING.md) before submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
