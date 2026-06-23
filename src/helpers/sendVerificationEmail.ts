import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { ReactElement } from "react";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  console.log("=== [sendVerificationEmail START] ===");
  console.log("📧 Input params:", { email, username, verifyCode });

  try {
    if (!email || !verifyCode) {
      console.error("❌ Missing email or verification code");
      return { success: false, message: "Invalid email or verification code." };
    }

    console.log("➡️ Preparing email with Resend...");
    console.log("➡️ Using FROM:", process.env.EMAIL_FROM || "onboarding@resend.dev");

    // Prepare React component
    let reactEmail: ReactElement;
    try {
      reactEmail = VerificationEmail({ username, otp: verifyCode }) as ReactElement;
      console.log("✅ VerificationEmail component created successfully");
    } catch (compErr) {
      console.error("🔥 Error creating VerificationEmail component:", compErr);
      return { success: false, message: "Invalid email template" };
    }

    // Send email
    console.log("📨 Sending email request to Resend API...");
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
      react: reactEmail,
    });

    console.log("✅ Resend API Response:", response);

    if (response.error) {
      console.error("❌ Resend API error:", response.error);
      return {
        success: false,
        message: "Resend API returned an error. Check logs.",
      };
    }

    console.log("🎉 Email sent successfully to:", email);
    console.log("=== [sendVerificationEmail END] ===");

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("🔥 Unexpected error sending verification email:", emailError);
    console.log("=== [sendVerificationEmail FAILED] ===");

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (emailError as Error).message
          : "Failed to send verification email.",
    };
  }
}
