async function notificationsHere() {
  const result = await getData('/api/notifications');
  console.log(result);
}

notificationsHere();
