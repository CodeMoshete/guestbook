const axios = require('axios');
const path = require('path');
const fs = require('fs');

exports.showDashboard = function showDashboard() {
  let html = '<!DOCTYPE html>\n<html>\n';

  const stylesPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-styles.css');
  const stylesContent = fs.readFileSync(stylesPath);
  html += '<head>\n';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1">\n';
  html += `<style>\n${stylesContent}\n</style>`;
  html += '</head>\n';

  html += '<body>\n';

  const scriptsPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-scripts.js');
  const scriptsContent = fs.readFileSync(scriptsPath);
  html += `<script>\n${scriptsContent}\n</script>\n`;

  html += '<div class="bgimg-1">\n';
  html += '<div class="caption">\n';
  html += '<span class="border">BEN & ASHLEY</span><br>\n';
  html += '<span class="border2">VIRTUAL GUEST BOOK</span><br>\n';
  html += '<span class="border3">JULY 11, 2020</span><br></br></br>\n';
  html += '<div class="inputContainer">\n';
  html += '<label style="color:white">Your Name:</label><input type="text" id="nameField" size=20%></br>';
  html += '<label style="color:white">Your Message:</label><input type="text" id="messageField" size=20%></br>';
  html += '<button id="submitButton" onclick=postMessage()>Submit</button>';
  html += '</div>\n';
  html += '</div>\n';
  html += '</div>\n';
  html += '</body>\n</html>';
  return html;
};
