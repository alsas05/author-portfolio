import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { DEFAULT_ABOUT_DATA } from '@/lib/about';

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'about_page_data' },
    });

    if (!setting) {
      return NextResponse.json({ about: DEFAULT_ABOUT_DATA });
    }

    const parsed = JSON.parse(setting.value);
    return NextResponse.json({ about: { ...DEFAULT_ABOUT_DATA, ...parsed } });
  } catch (error) {
    console.error('About data fetch error:', error);
    return NextResponse.json({ about: DEFAULT_ABOUT_DATA });
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
      where: { key: 'about_page_data' },
      update: { value: JSON.stringify(data) },
      create: {
        key: 'about_page_data',
        value: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, about: JSON.parse(updatedSetting.value) });
  } catch (error) {
    console.error('About data update error:', error);
    return NextResponse.json({ error: 'Failed to update about page' }, { status: 500 });
  }
}
