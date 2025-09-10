import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { authenticate, authorizeRoles } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const authCheck = authorizeRoles('admin')(auth.user);
    if (authCheck.error) {
      return NextResponse.json({ message: authCheck.error.message }, { status: authCheck.error.status });
    }

    const db = await connectToDb();
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();

    return NextResponse.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const authCheck = authorizeRoles('admin')(auth.user);
    if (authCheck.error) {
      return NextResponse.json({ message: authCheck.error.message }, { status: authCheck.error.status });
    }

    const { username, email, password, role } = await request.json();
    
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
      role,
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    const newUser = { ...user, _id: result.insertedId };
    delete newUser.password;

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
