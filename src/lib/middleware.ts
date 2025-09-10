import { verifyToken } from './auth';
import { User } from './types';

interface AuthenticatedRequest {
  headers: {
    get(name: string): string | null;
  };
}

interface AuthResult {
  user?: User;
  error?: {
    status: number;
    message: string;
  };
}

export function authenticate(req: AuthenticatedRequest): AuthResult {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: { status: 401, message: 'No token provided' } };
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token) as User;
    return { user: decoded };
  } catch {
    return { error: { status: 401, message: 'Invalid token' } };
  }
}

export function authorizeRoles(...roles: string[]) {
  return (user: User | undefined): AuthResult => {
    if (!user || !roles.includes(user.role)) {
      return { error: { status: 403, message: 'Forbidden: insufficient role' } };
    }
    return { user };
  };
}
