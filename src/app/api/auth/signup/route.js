import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, email, password, role } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'username, email and password are required' }, { status: 400 });
    }

    const db = await connectToDb();
    const existingUser = await db.collection('users').findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = {
      username,
      email,
      password: hashedPassword,
      role: role || 'rep',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    const newUser = { ...user, _id: result.insertedId };

    // Auto-login after signup
    const token = signToken({ userId: newUser._id.toString(), role: newUser.role });
    
    return NextResponse.json({
      token,
      user: { id: newUser._id.toString(), username: newUser.username, email: newUser.email, role: newUser.role }
    }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
