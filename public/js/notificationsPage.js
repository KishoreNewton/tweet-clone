async function notificationsHere() {
  const results = await getData('/api/notifications');
  let opened = {};
  results.forEach(result => {
    if (result.opened === true) {
    } else {
      opened['notification'] = true;
    }
  });

  if (opened === {}) {
    document.getElementById('notificationBadge').classList.remove('active');
  } else {
    console.log('working');
    document.getElementById('notificationBadge').classList.add('active');
  }

  outputNotificationList(results, document.getElementsByClassName('resultsContainer')[0]);
}

notificationsHere();

document.getElementById('markNotificationsAsRead').addEventListener('click', () => {
  markNotificationsAsOpened();
});

function outputNotificationList(notifications, container) {
  notifications.forEach(notification => {
    const html = createNotificationHtml(notification);
    const newElement = document.createElement('div');
    newElement.innerHTML = html;
    container.append(newElement);
  });

  if (notifications.length === 0) {
    const newElement = document.createElement('div');
    newElement.innerHTML = "<span class='noResults'>Nothing to Show.</span>";
    container.append(newElement);
  }
}

function createNotificationHtml(notification) {
  const userFrom = notification.userFrom;
  const text = getNotificationText(notification);
  const href = getNotificationUrl(notification);
  const className = notification.opened ? '' : 'active';

  return `<a href='${href}' id="datahere" class='resultListItem notification ${className}' data-id='${notification._id}' >
              <div class='resultsImageContainer'>
                  <img src='${userFrom.profilePic}'>
              </div>
              <div class='resultsDetailsContainer ellipsis blocked'>
                  <span class='ellipsis blocked'>${text}</span>
              </div>
          </a>`;
}

function getNotificationText(notification) {
  const userFrom = notification.userFrom;

  if (!userFrom.firstName || !userFrom.lastName) {
    return alert('user from data not populated');
  }

  const userFromName = `${userFrom.firstName} ${userFrom.lastName}`;

  let text;

  if (notification.notificationType == 'retweet') {
    text = `${userFromName} retweeted one of your posts`;
  } else if (notification.notificationType == 'postLike') {
    text = `${userFromName} liked one of your posts`;
  } else if (notification.notificationType == 'reply') {
    text = `${userFromName} replied to one of your posts`;
  } else if (notification.notificationType == 'follow') {
    text = `${userFromName} followed you`;
  }

  return `<span class='ellipsis'>${text}</span>`;
}

function getNotificationUrl(notification) {
  let url = '#';

  if (
    notification.notificationType == 'retweet' ||
    notification.notificationType == 'postLike' ||
    notification.notificationType == 'reply'
  ) {
    url = `/posts/${notification.entityId}`;
  } else if (notification.notificationType == 'follow') {
    url = `/profile/${notification.entityId}`;
  }

  return url;
}
