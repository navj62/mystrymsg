import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User';

export async function POST(request:Request) {
  await dbConnect();
  const{content,username}=await request.json()
  try {
    const user=await UserModel.findOne(
      {username}
    )

    if(!user){
       return Response.json(
      { success: false, message: 'User Not Found' },
      { status: 404 }
    );
    }
    // check if use is accepting mesg

    if(!user.isAcceptingMessages){
      return Response.json(
      { success: false, message: 'User Not Accepting messages' },
      { status: 403 }
      )
    }

    const newMessage={content,createdAt:new Date()}

    user.messages.push(newMessage as Message)
    await user.save()

     return Response.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
      )
  } catch (error) {
    console.error("Unexpected error occurred", error)
     return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
      )
  }
}