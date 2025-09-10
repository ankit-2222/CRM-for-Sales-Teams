import { verifyToken } from './auth.js';

export function authenticate(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: { status: 401, message: 'No token provided' } };
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    return { user: decoded };
  } catch (err) {
    return { error: { status: 401, message: 'Invalid token' } };
  }
}

export function authorizeRoles(...roles) {
  return (user) => {
    if (!user || !roles.includes(user.role)) {
      return { error: { status: 403, message: 'Forbidden: insufficient role' } };
    }
    return { user };
  };
}
