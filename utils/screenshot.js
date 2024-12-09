const screenshot = require('screenshot-desktop');
const fs = require('fs');

async function getScreens() {
  try {
    return await screenshot.listDisplays();
  } catch (error) {
    console.error('Error fetching screens:', error);
    return [];
  }
}

async function takeScreenshot(screenId) {
  const tempFilePath = `screenshot_${Date.now()}.png`;
  try {
    await screenshot({ screen: screenId, filename: tempFilePath });
    return tempFilePath;
  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  }
}

function cleanupFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error removing file:', filePath, error);
  }
}

module.exports = { getScreens, takeScreenshot, cleanupFile };
