import UserModel, { Message } from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { messageSchema } from '@/schemas/messageSchema';
import { z } from 'zod';

const sendMessageSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  content: messageSchema.shape.content,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Invalid message',
        },
        { status: 400 }
      );
    }

    const { username, content } = parsed.data;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: 'User Not Found' },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: 'User Not Accepting messages' },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error occurred', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
