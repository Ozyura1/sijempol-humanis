import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

function getEmailPassword() {
  return process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD
}

function isPlaceholder(value) {
  if (!value) return true
  return /^(your-|xxxx|app-password)/i.test(String(value).trim())
}

function isEmailConfigured() {
  const user = process.env.EMAIL_USER
  const password = getEmailPassword()
  return Boolean(user && password && !isPlaceholder(user) && !isPlaceholder(password))
}

function ensureEmailConfig() {
  if (!isEmailConfigured()) {
    throw new Error("Email belum dikonfigurasi. Isi EMAIL_USER dan EMAIL_APP_PASSWORD/EMAIL_PASSWORD.")
  }
}

function createTransporter() {
  ensureEmailConfig()

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: getEmailPassword(),
    },
  })
}

function getFromAddress() {
  if (!isPlaceholder(process.env.EMAIL_FROM)) {
    return process.env.EMAIL_FROM
  }

  return process.env.EMAIL_USER
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Generate random 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to user email
 */
export async function sendOTPEmail(email, otp, username) {
  try {
    if (!isEmailConfigured() && process.env.NODE_ENV !== "production") {
      console.warn("Email belum dikonfigurasi. OTP hanya dikembalikan untuk mode development.")
      return false
    }

    const transporter = createTransporter()
    const safeName = escapeHtml(username || "Pengguna")
    const safeOtp = escapeHtml(otp)

    const mailOptions = {
      from: getFromAddress(),
      to: email,
      subject: "Kode OTP Registrasi SiJempol Humanis",
      text: `Halo ${username || "Pengguna"}, kode OTP registrasi SiJempol Humanis Anda adalah ${otp}. Kode berlaku selama 10 menit.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verifikasi Email Anda</h2>

            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Halo <strong>${safeName}</strong>,
            </p>

            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Anda telah mendaftar di SiJempol Humanis. Gunakan kode OTP di bawah ini untuk menyelesaikan registrasi:
            </p>

            <div style="background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #007bff; margin-bottom: 20px;">
              <p style="font-size: 12px; color: #999; margin: 0 0 10px 0;">Kode OTP Anda:</p>
              <p style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 2px; margin: 0;">${safeOtp}</p>
            </div>

            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Kode OTP ini akan berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.
            </p>

            <p style="color: #666; font-size: 14px;">
              Jika Anda tidak melakukan pendaftaran ini, abaikan email ini.
            </p>

            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                (c) 2026 SiJempol Humanis. Semua hak cipta dilindungi.
              </p>
            </div>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending OTP email:", error)
    throw error
  }
}

/**
 * Send approval notification to user
 */
export async function sendApprovalEmail(email, username, resourceType, submissionId) {
  try {
    if (!isEmailConfigured() && process.env.NODE_ENV !== "production") {
      console.warn("Email belum dikonfigurasi. Notifikasi approval dilewati di mode development.")
      return false
    }

    const transporter = createTransporter()
    const resourceNames = {
      id_cards: "Kartu Identitas",
      births: "Surat Lahir",
      deaths: "Surat Kematian",
      marriages: "Surat Perkawinan",
      moves: "Surat Pindah",
      family_cards: "Kartu Keluarga",
    }

    const resourceName = resourceNames[resourceType] || resourceType
    const approvedAt = new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    const safeName = escapeHtml(username || "Pengguna")
    const safeResourceName = escapeHtml(resourceName)
    const safeSubmissionId = escapeHtml(submissionId)
    const safeApprovedAt = escapeHtml(approvedAt)

    const mailOptions = {
      from: getFromAddress(),
      to: email,
      subject: `Permohonan ${resourceName} Anda Telah Disetujui - SiJempol Humanis`,
      text: `Halo ${username || "Pengguna"}, permohonan ${resourceName} Anda dengan nomor referensi #${submissionId} telah disetujui oleh administrator pada ${approvedAt}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #28a745; margin-bottom: 20px;">Permohonan Disetujui</h2>

            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Halo <strong>${safeName}</strong>,
            </p>

            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Kami memberitahukan bahwa permohonan Anda telah <strong style="color: #28a745;">DISETUJUI</strong> oleh administrator.
            </p>

            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Jenis Layanan:</strong> ${safeResourceName}</p>
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Nomor Referensi:</strong> #${safeSubmissionId}</p>
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Tanggal Persetujuan:</strong> ${safeApprovedAt}</p>
            </div>

            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Anda dapat mengakses status permohonan kapan saja melalui akun SiJempol Humanis Anda.
            </p>

            <a href="${escapeHtml(process.env.FRONTEND_URL || "https://sijempolhumanis.web.id")}/dashboard" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-bottom: 20px;">
              Lihat Status Permohonan
            </a>

            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                (c) 2026 SiJempol Humanis. Semua hak cipta dilindungi.
              </p>
            </div>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending approval email:", error)
    throw error
  }
}

/**
 * Send rejection notification to user
 */
export async function sendRejectionEmail(email, username, resourceType, submissionId, rejectionReason = "") {
  try {
    if (!isEmailConfigured() && process.env.NODE_ENV !== "production") {
      console.warn("Email belum dikonfigurasi. Notifikasi rejection dilewati di mode development.")
      return false
    }

    const transporter = createTransporter()
    const resourceNames = {
      id_cards: "Kartu Identitas",
      births: "Surat Lahir",
      deaths: "Surat Kematian",
      marriages: "Surat Perkawinan",
      moves: "Surat Pindah",
      family_cards: "Kartu Keluarga",
    }

    const resourceName = resourceNames[resourceType] || resourceType
    const safeName = escapeHtml(username || "Pengguna")
    const safeResourceName = escapeHtml(resourceName)
    const safeSubmissionId = escapeHtml(submissionId)
    const safeReason = escapeHtml(rejectionReason)

    const mailOptions = {
      from: getFromAddress(),
      to: email,
      subject: `Update Status Permohonan ${resourceName} Anda - SiJempol Humanis`,
      text: `Halo ${username || "Pengguna"}, permohonan ${resourceName} Anda dengan nomor referensi #${submissionId} ditolak oleh administrator.${rejectionReason ? ` Alasan: ${rejectionReason}` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">Permohonan Ditolak</h2>

            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Halo <strong>${safeName}</strong>,
            </p>

            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Kami memberitahukan bahwa permohonan Anda telah <strong style="color: #dc3545;">DITOLAK</strong> oleh administrator.
            </p>

            <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Jenis Layanan:</strong> ${safeResourceName}</p>
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Nomor Referensi:</strong> #${safeSubmissionId}</p>
              ${safeReason ? `<p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Alasan Penolakan:</strong> ${safeReason}</p>` : ""}
            </div>

            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Silakan perbaiki data Anda dan ajukan kembali permohonan melalui akun SiJempol Humanis Anda.
            </p>

            <a href="${escapeHtml(process.env.FRONTEND_URL || "https://sijempolhumanis.web.id")}/dashboard" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-bottom: 20px;">
              Kembali ke Dashboard
            </a>

            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                (c) 2026 SiJempol Humanis. Semua hak cipta dilindungi.
              </p>
            </div>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending rejection email:", error)
    throw error
  }
}

export default {
  generateOTP,
  sendOTPEmail,
  sendApprovalEmail,
  sendRejectionEmail,
}
