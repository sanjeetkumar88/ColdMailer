export const CacheKeys = {
  sender:           (id: string) => `sender:${id}`,
  template:         (id: string) => `template:${id}`,
  campaignProgress: (id: string) => `campaign:${id}:progress`,
  rateLimit:        (userId: string) => `ratelimit:${userId}`,
  userSession:      (userId: string) => `session:${userId}`,
};
