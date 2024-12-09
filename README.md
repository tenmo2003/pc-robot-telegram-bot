# PC Robot Telegram Bot

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A Telegram bot that can control your PC through various commands such as playing/pausing media, taking screenshots, scheduling shutdowns, requesting and approving user access, fetching system stats, uploading files from the server, and more.

**GitHub Repo:** [https://github.com/monokaijs/pc-robot-telegram-bot](https://github.com/monokaijs/pc-robot-telegram-bot)

**Author:** [MonokaiJs](https://delimister.com) ([Telegram](https://t.me/delimister) | [Facebook](https://www.facebook.com/delimister))

## Features

- **Access Control:**  
  The first user to interact with the bot becomes the admin. Other users must send `/request_access` to request permission, which the admin can approve.

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
  [Download Node.js](https://nodejs.org/en/download/)

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
   The first user to send a message to the bot will become the admin. The admin can then approve other users who request access.

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

## Running the Bot Automatically with Forever

To ensure your Telegram bot runs continuously and starts automatically when your system boots, you can use `forever` (for Unix-based systems) or `forever-win` (for Windows).

### 1. Install Forever

- **For Unix-based Systems (Linux/macOS):**
  ```bash
  npm install -g forever
  ```

- **For Windows:**
  ```bash
  npm install -g forever-win
  ```

### 2. Start the Bot with Forever

- **For Unix-based Systems:**
  ```bash
  forever start bot.js
  ```

- **For Windows:**
  ```bash
  forever-win start bot.js
  ```

### 3. Set Up Automatic Startup

- **For Unix-based Systems (Linux/macOS):**
    - **Using systemd:**
        1. **Create a service file:** `/etc/systemd/system/pc-robot.service`
        2. **Add the following content:**
           ```ini
           [Unit]
           Description=PC Robot Telegram Bot
           After=network.target
    
           [Service]
           ExecStart=/usr/local/bin/forever start /path/to/pc-robot-telegram-bot/bot.js
           Restart=always
           User=your_username
           Group=your_group
           Environment=PATH=/usr/bin:/usr/local/bin
           Environment=NODE_ENV=production
           WorkingDirectory=/path/to/pc-robot-telegram-bot
    
           [Install]
           WantedBy=multi-user.target
           ```
        3. **Reload systemd and enable the service:**
           ```bash
           sudo systemctl daemon-reload
           sudo systemctl enable pc-robot.service
           sudo systemctl start pc-robot.service
           ```

- **For Windows:**
    - **Using Task Scheduler:**
        1. **Open Task Scheduler.**
        2. **Create a new task** with the following settings:
            - **Trigger:** At system startup
            - **Action:** Start a program
                - **Program/script:** `forever-win`
                - **Add arguments:** `start bot.js`
                - **Start in:** `C:\path\to\pc-robot-telegram-bot`
        3. **Save the task.** The bot will now start automatically when Windows boots.

### 4. Manage Forever Processes

- **List running processes:**
  ```bash
  forever list
  ```

- **Stop the bot:**
    - **Unix-based Systems:**
      ```bash
      forever stop bot.js
      ```
    - **Windows:**
      ```bash
      forever-win stop bot.js
      ```

- **Restart the bot:**
    - **Unix-based Systems:**
      ```bash
      forever restart bot.js
      ```
    - **Windows:**
      ```bash
      forever-win restart bot.js
      ```

**Note:**
- Forever ensures that your bot restarts automatically if it crashes or the system reboots.
- Regularly check the logs to monitor the bot's performance and troubleshoot any issues.

## Error Handling & Stability

- The bot uses `bot.catch()` to log errors and continue running, preventing crashes from unexpected issues.
- Ensure proper permissions and paths exist for files and commands to avoid runtime errors.

```javascript
bot.catch((err, ctx) => {
  console.error(`Bot Error: ${err}`, ctx.updateType);
});
```

## Contributing

1. **Fork the repository.**
2. **Create your feature branch:**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add new feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/new-feature
   ```
5. **Open a Pull Request.**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
