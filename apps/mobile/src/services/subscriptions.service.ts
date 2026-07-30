// Mock subscriptions service
export const subscriptionsService = {
  checkStatus: async () => {
    return {
      isPremium: true,
      expiresAt: '2027-01-01T00:00:00Z',
    };
  },
  
  purchasePremium: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  }
};
