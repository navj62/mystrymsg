import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ messageid: string }> }
) {
    const { messageid: messageId } = await params
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
            // $pull filters the messages array based on the condition
        )
        // modifiedCount === 0 means nothing matched, so no message was deleted
        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message Not Found or already deleted"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Message Deleted successfully"
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error deleting message:", error)
        return Response.json({
            success: false,
            message: "Error Deleting message"
        }, { status: 500 })
    }
}
