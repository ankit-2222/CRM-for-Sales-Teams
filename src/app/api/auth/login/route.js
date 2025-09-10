import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ message: 'email and password are required' }, { status: 400 });
    }

    const db = await connectToDb();
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });
    
    return NextResponse.json({
      token,
      user: { id: user._id.toString(), username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
