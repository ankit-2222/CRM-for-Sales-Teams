import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { authenticate } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const db = await connectToDb();
    const opportunity = await db.collection('opportunities').findOne({ _id: new ObjectId(params.id) });
    
    if (!opportunity) {
      return NextResponse.json({ message: 'Opportunity not found' }, { status: 404 });
    }

    if (auth.user.role === 'rep' && opportunity.ownerId !== auth.user.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(opportunity);
  } catch (err) {
    console.error('Get opportunity error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const db = await connectToDb();
    const opportunity = await db.collection('opportunities').findOne({ _id: new ObjectId(params.id) });
    
    if (!opportunity) {
      return NextResponse.json({ message: 'Opportunity not found' }, { status: 404 });
    }

    if (auth.user.role === 'rep' && opportunity.ownerId !== auth.user.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updates = await request.json();
    await db
      .collection("opportunities")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

    const updatedOpportunity = await db.collection('opportunities').findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(updatedOpportunity);
  } catch (err) {
    console.error('Update opportunity error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = authenticate(request);
    if (auth.error) {
      return NextResponse.json({ message: auth.error.message }, { status: auth.error.status });
    }

    const db = await connectToDb();
    const opportunity = await db.collection('opportunities').findOne({ _id: new ObjectId(params.id) });
    
    if (!opportunity) {
      return NextResponse.json({ message: 'Opportunity not found' }, { status: 404 });
    }

    if (auth.user.role === 'rep' && opportunity.ownerId !== auth.user.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await db.collection('opportunities').deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ message: 'Opportunity deleted' });
  } catch (err) {
    console.error('Delete opportunity error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
