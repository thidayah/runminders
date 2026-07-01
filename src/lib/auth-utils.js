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
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET env variable is not set');
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Verify admin token — returns { decoded } or { error, status }
export async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token autentikasi diperlukan', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return { error: 'Token tidak valid atau telah kedaluwarsa', status: 401 };
  }
  if (decoded.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini', status: 403 };
  }
  return { decoded };
}

// Verify any authenticated user — returns decoded or null
export function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.split(' ')[1]);
}
