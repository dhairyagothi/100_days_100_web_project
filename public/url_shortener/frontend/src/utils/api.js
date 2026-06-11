const BASE_URL = process.env.REACT_APP_API_URL;

// 🔹 Static endpoints
export const endpoints = {
  ME: `${BASE_URL}/api/me`,
  SHORTEN: `${BASE_URL}/api/shorten`,
  LOGOUT: `${BASE_URL}/api/logout`,
  LOGIN: `${BASE_URL}/login`,
  SIGNUP: `${BASE_URL}/signup`,
};

// 🔹 Dynamic endpoints
export const dynamicEndpoints = {
  VERIFY: (ShortCode) => `${BASE_URL}/verify/${ShortCode}`,
};
