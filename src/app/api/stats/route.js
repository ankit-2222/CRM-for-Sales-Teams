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
    const isRep = auth.user.role === 'rep';
    const ownerFilter = isRep ? { ownerId: auth.user.userId } : {};

    const [leadsCount, oppsCount, wonCount, leadsByStatus, oppsByStage] = await Promise.all([
      db.collection('leads').countDocuments(ownerFilter),
      db.collection('opportunities').countDocuments(ownerFilter),
      db.collection('opportunities').countDocuments({ ...ownerFilter, stage: 'Won' }),
      db.collection('leads').aggregate([
        { $match: ownerFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray(),
      db.collection('opportunities').aggregate([
        { $match: ownerFilter },
        { $group: { _id: '$stage', count: { $sum: 1 } } }
      ]).toArray()
    ]);

    return NextResponse.json({
      leads: leadsCount,
      opportunities: oppsCount,
      won: wonCount,
      leadsByStatus: leadsByStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      oppsByStage: oppsByStage.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
    });
  } catch (err) {
    console.error('Get stats error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
