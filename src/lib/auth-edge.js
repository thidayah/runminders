import { jwtVerify } from 'jose';

export async function verifyTokenEdge(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, email, role, name, iat, exp }
  } catch {
    return null;
  }
}
