const debug = require('debug')('guestbook-server');
const path = require('path');
const fs = require('fs');

const contentDir = 'admin_dashboard_content';

function generateEntry(entryIp, entry, queueName) {
  const isPending = queueName === 'pending';
  let html = '<div class="entryContainer">';
  html += `<p class="entryName"><b>${entry.name}</b></p>`;
  html += `<p class="entryText">${entry.message}</p>`;
  if (isPending) {
    html +=
      '<button class="submitBtn" onclick="approveGuestbookEntry(' +
      `'${entryIp}')">Approve</button>`;
  }
  html +=
    '<button class="submitBtn" onclick="deleteGuestbookEntry(' +
    `'${entryIp}', '${queueName}')">Delete</button>`;
  html += '</div></br></br>';
  return html;
}

function getContent(contentPath, queueName) {
  let entriesHtml = '';
  if (fs.existsSync(contentPath)) {
    const entriesContent = JSON.parse(fs.readFileSync(contentPath));
    const allEntriesKeys = Object.keys(entriesContent);
    for (let i = 0, count = allEntriesKeys.length; i < count; i += 1) {
      entriesHtml += generateEntry(
        allEntriesKeys[i], entriesContent[allEntriesKeys[i]], queueName
      );
    }
  }
  return entriesHtml;
}

exports.showDashboard = async function showDashboard(serverIp) {
  debug('Show Dashboard');
  const htmlPath =
    path.join(global.appRoot, 'src', contentDir, 'admin-dashboard-content.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-styles.css');
  const stylesContent = fs.readFileSync(stylesPath);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', contentDir, 'admin-dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*SERVER-ADDRESS*/').join(serverIp);
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);

  const pendingListPath = path.join(global.appRoot, 'guestbook_data', 'messages_pending.json');
  html = html.replace('/*PENDING_ENTRIES_CONTENT*/', getContent(pendingListPath, 'pending'));

  const liveListPath = path.join(global.appRoot, 'guestbook_data', 'messages_live.json');
  html = html.replace('/*LIVE_ENTRIES_CONTENT*/', getContent(liveListPath, 'live'));

  const archivedListPath = path.join(global.appRoot, 'guestbook_data', 'messages.json');
  html = html.replace('/*ARCHIVED_ENTRIES_CONTENT*/', getContent(archivedListPath, 'archive'));

  return html;
};
