import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { authenticate, authorizeRoles } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
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
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(params.id) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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
    const user = await db.collection('users').findOne({ _id: new ObjectId(params.id) });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { username, email, password, role } = await request.json();
    const updates = { updatedAt: new Date() };
    
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (password) updates.password = await hashPassword(password);

    await db.collection('users').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    );

    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(params.id) },
      { projection: { password: 0 } }
    );

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error('Update user error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const authCheck = authorizeRoles('admin')(auth.user);
    if (authCheck.error) {
      return NextResponse.json({ message: authCheck.error.message }, { status: auth.error.status });
    }

    const db = await connectToDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(params.id) });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await db.collection('users').deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
