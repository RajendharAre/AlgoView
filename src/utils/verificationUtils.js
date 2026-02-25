import CryptoJS from 'crypto-js';

/**
 * Generate a random 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash the verification code for secure storage
 */
export const hashVerificationCode = (code) => {
  // Using simple SHA256 hash - in production, use bcrypt on backend
  return CryptoJS.SHA256(code).toString();
};

/**
 * Verify code by comparing hashes
 */
export const verifyCodeHash = (inputCode, storedHash) => {
  const inputHash = CryptoJS.SHA256(inputCode).toString();
  return inputHash === storedHash;
};

/**
 * Check if verification code has expired
 */
export const isCodeExpired = (expiryTimestamp) => {
  return Date.now() > expiryTimestamp;
};

/**
 * Calculate expiry time (10 minutes from now in milliseconds)
 */
export const getCodeExpiryTime = (minutesValid = 10) => {
  return Date.now() + minutesValid * 60 * 1000;
};
