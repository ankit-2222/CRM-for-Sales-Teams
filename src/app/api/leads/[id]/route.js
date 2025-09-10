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
    const lead = await db.collection('leads').findOne({ _id: new ObjectId(params.id) });
    
    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    if (auth.user.role === 'rep' && lead.ownerId !== auth.user.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(lead);
  } catch (err) {
    console.error('Get lead error:', err);
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
    const lead = await db.collection('leads').findOne({ _id: new ObjectId(params.id) });
    
    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    if (auth.user.role === 'rep' && lead.ownerId !== auth.user.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updates = await request.json();
    const result = await db.collection('leads').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    const updatedLead = await db.collection('leads').findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(updatedLead);
  } catch (err) {
    console.error('Update lead error:', err);
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
    const lead = await db.collection('leads').findOne({ _id: new ObjectId(params.id) });
    
    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    if (auth.user.role === 'rep' && lead.ownerId !== auth.user.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await db.collection('leads').deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ message: 'Lead deleted' });
  } catch (err) {
    console.error('Delete lead error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
