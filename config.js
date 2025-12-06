// config.js
const LAN_IP = "192.168.254.107"; 
const PORT = 5000;

export const API_URL = __DEV__
  ? `http://${LAN_IP}:${PORT}/api` // Development (Expo Go on phone)
  : "https://managementsystem-backend.onrender.com/api";
