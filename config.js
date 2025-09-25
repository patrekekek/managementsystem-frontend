// config.js
const LAN_IP = "192.168.254.107"; // 👈 replace with your computer’s LAN IP
const PORT = 5000;

export const API_URL = __DEV__
  ? `http://${LAN_IP}:${PORT}/api` // Development (Expo Go on phone)
  : "https://your-production-url.com/api"; // Replace with deployed backend URL
