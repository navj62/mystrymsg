import { getResend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { ReactElement } from "react";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    if (!email || !verifyCode) {
      return { success: false, message: "Invalid email or verification code." };
    }

    // Prepare React component
    let reactEmail: ReactElement;
    try {
      reactEmail = VerificationEmail({ username, otp: verifyCode }) as ReactElement;
    } catch (compErr) {
      console.error("Error creating VerificationEmail component:", compErr);
      return { success: false, message: "Invalid email template" };
    }

    const response = await getResend().emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
      react: reactEmail,
    });

    if (response.error) {
      console.error("Resend API error:", response.error);
      return {
        success: false,
        message: "Resend API returned an error. Check logs.",
      };
    }

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Unexpected error sending verification email:", emailError);

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (emailError as Error).message
          : "Failed to send verification email.",
    };
  }
}
