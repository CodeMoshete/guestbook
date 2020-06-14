const debug = require('debug')('guestbook-server');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const ip = require('ip');

function generateEntry(entry) {
  let html = `<p>${entry.name}</p>`;
  html += `<p>${entry.message}</p>`;
  return html;
}

exports.showDashboard = function showDashboard() {
  const htmlPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-content.html');
  let html = fs.readFileSync(htmlPath).toString();
  debug(`HTML: ${html}`);

  const stylesPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-styles.css');
  const stylesContent = fs.readFileSync(stylesPath);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*IP-ADDRESS*/').join(ip.address());
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);

  return html;
};
