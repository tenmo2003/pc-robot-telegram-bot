# PC Robot Telegram Bot

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A Telegram bot that can control your PC through various commands such as playing/pausing media, taking screenshots,
scheduling shutdowns, requesting and approving user access, fetching system stats, uploading files from the server, and
more.

**GitHub Repo:** [https://github.com/monokaijs/pc-robot-telegram-bot](https://github.com/monokaijs/pc-robot-telegram-bot)

**Author:** [MonokaiJs](https://delimister.com) ([Telegram](https://t.me/delimister) | [Facebook](https://www.facebook.com/delimister))

## Features

- **Access Control:**  
  The first user to interact with the bot becomes the admin. Other users must send `/request_access` to request
  permission, which the admin can approve.

- **Media Control:**  
  Control media playback (play/pause, next, previous, volume up/down, mute) remotely.

- **Screenshots:**  
  Capture screenshots of any monitor connected to the system and receive the images directly in Telegram.

- **File Upload:**  
  Upload files from the server's filesystem to the user via the bot.

- **System Management:**  
  Schedule or cancel system shutdowns, view system stats (CPU, RAM, top processes), and retrieve the server’s public IP.

- **Command Hints:**  
  When typing `/` in Telegram, the bot shows a list of available commands as hints.

## Requirements

- **Node.js:** v14 or higher recommended.
- **NPM:** v6 or higher.
- **Telegram Bot Token:** From [BotFather](https://t.me/BotFather).
- **Platform-Specific Tools:**
    - *Windows:* `DisplaySwitch.exe` for display switching, `taskkill` for ending processes.
    - *Linux/macOS:* `xrandr`, `ps`, `shutdown`, `pkill` commands if needed.

## Setup Instructions

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/monokaijs/pc-robot-telegram-bot.git
   cd pc-robot-telegram-bot
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` File:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and put your Telegram bot token:
   ```
   TELEGRAM_TOKEN=1234567890:ABC-YourTelegramBotTokenHere
   ```

4. **Run the Bot:**
   ```bash
   node bot.js
   ```

5. **First Interaction:**
   The first user to send a message to the bot will become the admin. The admin can then approve other users who request
   access.

## File Structure

- **bot.js:** Main entry point that initializes the bot, sets commands, loads middleware, and starts the bot.
- **commands/**: Contains individual command files (e.g., `request_access.js`, `upload.js`, `stats.js`, etc.).
- **middleware/**: Contains middleware like access checks and first-user-becomes-admin logic.
- **callback_handlers/**: Contains handlers for inline callback queries (e.g., approving access requests).
- **utils/**: Utility files for reading/writing user data and managing access control.

## Example Commands

- `/request_access`: Request access if you’re not an admin or allowed user.
- `/control`: Show media controls and screenshot options.
- `/screenshot`: Capture and receive a screenshot.
- `/upload <path>`: Send a file located on the server.
- `/cancel_shutdown`: Cancel any scheduled shutdown.
- `/stats`: Display CPU load, memory usage, and top processes.
- `/getip`: Get the server’s public IP.
- `/secret`: A protected command only available to allowed users and admin.

## Error Handling & Stability

- The bot uses `bot.catch()` to log errors and continue running.
- Ensure proper permissions and paths exist for files and commands.

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/new-feature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/new-feature`.
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
