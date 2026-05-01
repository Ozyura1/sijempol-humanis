import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
  },
})

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
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Kode OTP Registrasi SiJempol Humanis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verifikasi Email Anda</h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Halo <strong>${username}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Anda telah mendaftar di SiJempol Humanis. Gunakan kode OTP di bawah ini untuk menyelesaikan registrasi:
            </p>
            
            <div style="background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #007bff; margin-bottom: 20px;">
              <p style="font-size: 12px; color: #999; margin: 0 0 10px 0;">Kode OTP Anda:</p>
              <p style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 2px; margin: 0;">${otp}</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Kode OTP ini akan berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              Jika Anda tidak melakukan pendaftaran ini, abaikan email ini.
            </p>
            
            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2026 SiJempol Humanis. Semua hak cipta dilindungi.
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
export async function sendApprovalEmail(email, username, resourceType, submissionId, submissionData = {}) {
  try {
    const resourceNames = {
      id_cards: "Kartu Identitas",
      births: "Surat Lahir",
      deaths: "Surat Kematian",
      marriages: "Surat Perkawinan",
      moves: "Surat Pindah",
      family_cards: "Kartu Keluarga",
    }
    
    const resourceName = resourceNames[resourceType] || resourceType
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `Permohonan ${resourceName} Anda Telah Disetujui - SiJempol Humanis`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #28a745; margin-bottom: 20px;">✓ Permohonan Disetujui</h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Halo <strong>${username}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Kami dengan senang hati memberitahukan bahwa permohonan Anda telah <strong style="color: #28a745;">DISETUJUI</strong> oleh administrator.
            </p>
            
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Jenis Layanan:</strong> ${resourceName}</p>
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Nomor Referensi:</strong> #${submissionId}</p>
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Tanggal Persetujuan:</strong> ${new Date().toLocaleDateString("id-ID", { 
                year: "numeric", 
                month: "long", 
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}</p>
            </div>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Anda dapat mengakses status permohonan Anda kapan saja melalui akun SiJempol Humanis Anda.
            </p>
            
            <a href="${process.env.FRONTEND_URL || "https://sijempolhumanis.web.id"}/dashboard" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-bottom: 20px;">
              Lihat Status Permohonan
            </a>
            
            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2026 SiJempol Humanis. Semua hak cipta dilindungi.
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
    const resourceNames = {
      id_cards: "Kartu Identitas",
      births: "Surat Lahir",
      deaths: "Surat Kematian",
      marriages: "Surat Perkawinan",
      moves: "Surat Pindah",
      family_cards: "Kartu Keluarga",
    }
    
    const resourceName = resourceNames[resourceType] || resourceType
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `Update Status Permohonan ${resourceName} Anda - SiJempol Humanis`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">⚠ Permohonan Ditolak</h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Halo <strong>${username}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Kami ingin memberitahukan bahwa permohonan Anda telah <strong style="color: #dc3545;">DITOLAK</strong> oleh administrator.
            </p>
            
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Jenis Layanan:</strong> ${resourceName}</p>
              <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Nomor Referensi:</strong> #${submissionId}</p>
              ${rejectionReason ? `<p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Alasan Penolakan:</strong> ${rejectionReason}</p>` : ""}
            </div>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Silakan perbaiki data Anda dan ajukan kembali permohonan melalui akun SiJempol Humanis Anda.
            </p>
            
            <a href="${process.env.FRONTEND_URL || "https://sijempolhumanis.web.id"}/dashboard" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-bottom: 20px;">
              Kembali ke Dashboard
            </a>
            
            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2026 SiJempol Humanis. Semua hak cipta dilindungi.
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
