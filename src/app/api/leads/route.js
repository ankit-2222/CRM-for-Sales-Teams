import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { authenticate } from '@/lib/middleware';

export async function GET(request) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const db = await connectToDb();
    let leads;
    
    if (auth.user.role === 'rep') {
      leads = await db.collection('leads').find({ ownerId: auth.user.userId }).toArray();
    } else {
      leads = await db.collection('leads').find().toArray();
    }

    return NextResponse.json(leads);
  } catch (err) {
    console.error('Get leads error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const { name, email, phone, status, ownerId } = await request.json();
    
    let assignedOwnerId = ownerId;
    if (auth.user.role === 'rep') {
      assignedOwnerId = auth.user.userId;
    }

    const db = await connectToDb();
    const lead = {
      name,
      email,
      phone,
      status: status || 'New',
      ownerId: assignedOwnerId,
      createdAt: new Date()
    };

    const result = await db.collection('leads').insertOne(lead);
    const newLead = { ...lead, _id: result.insertedId };

    return NextResponse.json(newLead, { status: 201 });
  } catch (err) {
    console.error('Create lead error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
