const os = require('os');
const { exec } = require('child_process');

module.exports = (bot) => {
  bot.command('stats', async (ctx) => {
    try {
      // Gather CPU and memory stats
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

      // CPU load average (On Windows this will be 0,0,0)
      const loadAvg = os.loadavg().map(v => v.toFixed(2)).join(', ');

      const platform = process.platform;
      let command;

      if (platform === 'win32') {
        command = `powershell -Command "Get-WmiObject Win32_PerfFormattedData_PerfProc_Process | Where-Object { $_.Name -notmatch '_Total|Idle|System' } | Sort-Object PercentProcessorTime -Descending | Select-Object -First 10 Name, PercentProcessorTime, WorkingSet"`;
      } else {
        // On Linux/macOS: top 10 CPU-consuming processes using ps
        // head -n 11: 1 line of header + 10 lines of processes
        command = 'ps -eo pid,comm,pcpu,pmem --sort=-pcpu | head -n 11';
      }

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error fetching processes:', error);
          ctx.reply('Failed to retrieve process list.');
          return;
        }

        let response = `*System Stats*\n`;
        response += `*CPU Load Avg:* ${loadAvg}\n`;
        response += `*Memory Usage:* ${memUsagePercent}% (Used ${(usedMem / (1024 * 1024)).toFixed(2)} MB / Total ${(totalMem / (1024 * 1024)).toFixed(2)} MB)\n\n`;
        response += `*Top 10 Processes:*\n`;

        if (platform === 'win32') {

          const lines = stdout.trim().split('\n');
          const header = lines.shift();
          response += '```\n' + header + '\n';

          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            // Expecting something like: [Name, PercentProcessorTime, WorkingSet]
            if (parts.length >= 3) {
              const name = parts[0];
              const cpu = parts[1];
              const workingSetBytes = parseInt(parts[2], 10);
              const workingSetMB = (workingSetBytes / (1024 * 1024)).toFixed(2);
              response += `${name.padEnd(20)} ${cpu.padEnd(10)} ${workingSetMB}MB\n`;
            } else {
              // If we can't parse properly, just print the line as is.
              response += line + '\n';
            }
          }

          response += '```\n';
        } else {
          // On Linux/macOS, we trust ps output to be already formatted nicely
          response += '```\n' + stdout.trim() + '\n```\n';
        }

        ctx.replyWithMarkdown(response);
      });
    } catch (err) {
      console.error('Error retrieving stats:', err);
      ctx.reply('An error occurred while retrieving system stats.');
    }
  });
};
