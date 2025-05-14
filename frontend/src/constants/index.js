const BASE_URL = 'http://localhost:3001';

const endpoints = {
  login: `${BASE_URL}/login`,
  ressetPassword: `${BASE_URL}/send-verification`,
  verifyCode: `${BASE_URL}/verify-code`,
  setNewPassword: `${BASE_URL}/set-new-password`,
};

export {
    endpoints
}