import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { authenticate } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
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

    const { title, value, stage } = await request.json();

    // Update lead status to Qualified
    await db.collection('leads').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status: 'Qualified', updatedAt: new Date() } }
    );

    // Create opportunity
    const opportunity = {
      title: title || lead.name,
      value: value || 0,
      stage: stage || 'Discovery',
      ownerId: lead.ownerId,
      leadId: lead._id.toString(),
      createdAt: new Date()
    };

    const result = await db.collection('opportunities').insertOne(opportunity);
    const newOpportunity = { ...opportunity, _id: result.insertedId };

    return NextResponse.json({ 
      message: 'Lead converted to opportunity', 
      opportunity: newOpportunity 
    });
  } catch (err) {
    console.error('Convert lead error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
