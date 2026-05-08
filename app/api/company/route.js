import { NextResponse } from 'next/server';
import db from '@/models';

export async function GET() {
  try {
    const companies = await db.Company.findAll({
      include: [
        {
          model: db.User,
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, location, users } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

  
    const company = await db.Company.create({
      name,
      email,
      location,
    });

   
    if (users && users.length > 0) {
      
      await company.setUsers(users);
    }

    return NextResponse.json({
      message: 'Company created successfully',
      company,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Company email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
