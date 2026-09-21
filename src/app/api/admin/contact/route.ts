import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { DEFAULT_CONTACT_DATA } from '@/lib/contact';

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'contact_page_data' },
    });

    if (!setting) {
      return NextResponse.json({ contact: DEFAULT_CONTACT_DATA });
    }

    const parsed = JSON.parse(setting.value);
    return NextResponse.json({ contact: { ...DEFAULT_CONTACT_DATA, ...parsed } });
  } catch (error) {
    console.error('Contact data fetch error:', error);
    return NextResponse.json({ contact: DEFAULT_CONTACT_DATA });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const updatedSetting = await prisma.siteSetting.upsert({
      where: { key: 'contact_page_data' },
      update: { value: JSON.stringify(data) },
      create: {
        key: 'contact_page_data',
        value: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, contact: JSON.parse(updatedSetting.value) });
  } catch (error) {
    console.error('Contact data update error:', error);
    return NextResponse.json({ error: 'Failed to update contact data' }, { status: 500 });
  }
}
