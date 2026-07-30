// Mock notifications service
export const notificationsService = {
  registerForPushNotifications: async () => {
    console.log('Registering for push notifications');
    return 'mock-device-token';
  },
  
  scheduleReminder: async (title: string, body: string, date: Date) => {
    console.log(`Scheduled reminder: ${title} for ${date.toISOString()}`);
    return true;
  }
};
