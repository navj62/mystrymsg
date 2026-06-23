import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { verifySchema } from '@/schemas/verifySchema';
import { z } from 'zod';

const verifyCodeSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  code: verifySchema.shape.code,
});

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const parsed = verifyCodeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Invalid input',
        },
        { status: 400 }
      );
    }

    const decodedUsername = decodeURIComponent(parsed.data.username);
    const { code } = parsed.data;
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: true, message: 'Account is already verified' },
        { status: 200 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}
