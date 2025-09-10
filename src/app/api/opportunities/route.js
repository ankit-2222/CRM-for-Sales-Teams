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
    let opportunities;
    
    if (auth.user.role === 'rep') {
      opportunities = await db.collection('opportunities').find({ ownerId: auth.user.userId }).toArray();
    } else {
      opportunities = await db.collection('opportunities').find().toArray();
    }

    return NextResponse.json(opportunities);
  } catch (err) {
    console.error('Get opportunities error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const { title, value, stage, ownerId, leadId } = await request.json();
    
    let assignedOwnerId = ownerId;
    if (auth.user.role === 'rep') {
      assignedOwnerId = auth.user.userId;
    }

    const db = await connectToDb();
    const opportunity = {
      title,
      value,
      stage: stage || 'Discovery',
      ownerId: assignedOwnerId,
      leadId,
      createdAt: new Date()
    };

    const result = await db.collection('opportunities').insertOne(opportunity);
    const newOpportunity = { ...opportunity, _id: result.insertedId };

    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (err) {
    console.error('Create opportunity error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
