const debug = require('debug')('guestbook-server');
const path = require('path');
const fs = require('fs');

const contentDir = 'admin_dashboard_content';

function generateEntry(entry) {
  let html = '<div class="entryContainer">';
  html += `<p class="entryName"><b>${entry.name}</b></p>`;
  html += `<p class="entryText">${entry.message}</p>`;
  html += '</div></br></br>';
  return html;
}

exports.showDashboard = async function showDashboard(serverIp, clientIp) {
  debug('Show Dashboard');
  const htmlPath =
    path.join(global.appRoot, 'src', contentDir, 'dashboard-content.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', contentDir, 'dashboard-styles.css');
  const stylesContent = fs.readFileSync(stylesPath);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', contentDir, 'dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*SERVER-ADDRESS*/').join(serverIp);
  scriptsContent = scriptsContent.split('/*CLIENT-ADDRESS*/').join(clientIp);
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);

  let alreadySignedContent = '';
  let yourEntryContent = '';
  let entryContent = '';
  const entriesListPath = path.join(global.appRoot, 'guestbook_data', 'messages.json');
  if (fs.existsSync(entriesListPath)) {
    const entriesContent = JSON.parse(fs.readFileSync(entriesListPath));
    const allEntriesKeys = Object.keys(entriesContent);
    const numEntiesToDisplay = Math.min(allEntriesKeys.length, 10);
    for (let i = 0; i < numEntiesToDisplay; i += 1) {
      if (allEntriesKeys[i] !== clientIp) {
        entryContent += generateEntry(entriesContent[allEntriesKeys[i]]);
      }
    }

    if (entriesContent[clientIp] !== undefined) {
      alreadySignedContent = 'YOU SIGNED THIS GUEST BOOK ALREADY, ' +
        'BUT YOU CAN RESUBMIT TO CHANGE YOUR ENTRY.';
      yourEntryContent = generateEntry(entriesContent[clientIp]);
    }
  }

  html = html.split('/*ENTRIES-CONTENT*/').join(entryContent);
  html = html.split('/*ALREADY-SIGNED*/').join(alreadySignedContent);
  html = html.split('/*YOUR-ENTRY*/').join(yourEntryContent);

  return html;
};
