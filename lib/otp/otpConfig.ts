// lib/otp/otpConfig.ts

export const OTP_FIELDS = [
  "email",
  "mobile",
  "alternateMobile",
  "password",
  "gst",
  "pan",
  "cin",
  "pcbRegistrationId",
  "consentStatus",
  "industryCategory",
  "monitoringMethod",
] as const;

export type OtpField = typeof OTP_FIELDS[number];

export function requiresOtp(field: string) {
  return OTP_FIELDS.includes(field as OtpField);
}
