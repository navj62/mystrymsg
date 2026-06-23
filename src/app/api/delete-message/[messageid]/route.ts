import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { get } from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import { success } from "zod"

export async function DELETE(request:Request,{prams}:{prams:{messageid:string}}) {
    const messageId=prams.messageid
   await dbConnect()
   const session=await getServerSession(authOptions)
   const user=session?.user

   if(!session || !session.user){
    return Response.json({
        success:false,
        message:"Not Authnticated"
    },{status:500})
   }
    
   try {
   const updatedResult= await UserModel.updateOne(
        {_id:user._id},
        {$pull:{messages:{_id:messageId}}}
        // $pull will filter base on the condintion
    )
    // if modifiedcount==0 means there is no change that means
    // no msg is deleted
    if(updatedResult.modifiedCount==0){
        return Response.json({
        success:false,
        message:"Message Not Deleted"
    },{status:404})
    }

    return Response.json({
        success:true,
        message:"Message Deleted succesfully"
    },{status:200})
   } 
   catch (error) {
    return Response.json({
        success:false,
        message:"Error Deleting message"
    },{status:500})
   }
}