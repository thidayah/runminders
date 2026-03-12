import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate verification token
export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate reset password token
export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isStrongPassword(password) {
  // Minimal 8 karakter, ada huruf besar, kecil, angka, dan simbol
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+-=,./;']{8,}$/; //@$!%*?&  
  return passwordRegex.test(password);
}

// Validate jwt token
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};
