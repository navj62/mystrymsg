import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import crypto from 'crypto';

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { username, email, password } = body;

    // Basic validation
    if (!username || !email || !password) {
      return Response.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if username is already taken (among verified users)
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: 'Username is not available' },
        { status: 400 }
      );
    }

    // Check email existence
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate secure 6-digit verification code
    const verifyCode = crypto.randomInt(100000, 999999).toString();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: 'Email is already in use' },
          { status: 400 }
        );
      }

      // Update existing unverified user
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = expiryDate;
      await existingUserByEmail.save();
    } else {
      // Create new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email *after* saving
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      // Dev fallback: Resend's free tier only delivers to the account owner's
      // address, so signing up with any other email fails to send. In
      // development, don't dead-end — log the code so the verify step still
      // works locally. In production, fail loudly (configure a verified domain).
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[DEV] Email delivery failed; verification code for ${email} (@${username}): ${verifyCode}`
        );
        return Response.json(
          {
            success: true,
            message:
              'User registered. Email delivery is not configured — check the server console for your verification code.',
          },
          { status: 201 }
        );
      }

      return Response.json(
        { success: false, message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          'User registered successfully. Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      { success: false, message: 'Something went wrong, please try again' },
      { status: 500 }
    );
  }
}
