type Listener = (token: string | null) => void;

let accessToken: string | null = null;
const listeners = new Set<Listener>();

export const authStore = {
  getAccessToken() {
    return accessToken;
  },
  setAccessToken(token: string | null) {
    accessToken = token;
    listeners.forEach((listener) => listener(accessToken));
  },
  clear() {
    accessToken = null;
    listeners.forEach((listener) => listener(accessToken));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
