import { NextResponse } from 'next/server';
import { verifyEmailConfig } from 'src/lib/nodemailer';

export async function GET() {
  try {
    const result = await verifyEmailConfig();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email configuration verified successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Email configuration verification failed', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying email configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
