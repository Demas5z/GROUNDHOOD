import nodemailer from 'nodemailer'

/**
 * Reusable Gmail SMTP transport.
 * Requires these env vars (see .env):
 *   SMTP_USER  — your full Gmail address (e.g. you@gmail.com)
 *   SMTP_PASS  — a Google "App Password" (16 chars, NOT your normal password)
 *   MAIL_FROM  — optional "Display Name <you@gmail.com>", defaults to SMTP_USER
 */
function getTransport() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error(
      'Email belum dikonfigurasi. Set SMTP_USER dan SMTP_PASS (App Password Gmail) di .env'
    )
  }
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })
}

export function appUrl() {
  return (
    process.env.APP_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export async function sendVerificationEmail(to: string, name: string | null, token: string) {
  const link = `${appUrl()}/verify?token=${token}`
  const from = process.env.MAIL_FROM || `GROUNDHOOD <${process.env.SMTP_USER}>`

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#1a1a1a;padding:40px 0;color:#d4d2cb">
    <div style="max-width:480px;margin:0 auto;background:#222;border:1px solid #333;border-radius:12px;padding:36px">
      <h1 style="font-size:20px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">GROUNDHOOD</h1>
      <p style="color:#a8a69f;font-size:13px;margin:0 0 24px">Konfirmasi alamat email kamu</p>
      <p style="font-size:14px;line-height:1.6">Halo ${name || 'there'}, terima kasih sudah mendaftar.
      Klik tombol di bawah untuk mengaktifkan akunmu. Link berlaku 24 jam.</p>
      <p style="text-align:center;margin:28px 0">
        <a href="${link}" style="background:#d4d2cb;color:#1a1a1a;text-decoration:none;
           padding:13px 30px;border-radius:100px;font-size:12px;font-weight:700;
           letter-spacing:1.5px;text-transform:uppercase">Verifikasi Email</a>
      </p>
      <p style="font-size:11px;color:#75736d;line-height:1.6">Jika tombol tidak bekerja, salin link ini ke browser:<br>
      <span style="color:#a8a69f;word-break:break-all">${link}</span></p>
      <p style="font-size:11px;color:#75736d;margin-top:24px">Abaikan email ini jika kamu tidak merasa mendaftar.</p>
    </div>
  </div>`

  await getTransport().sendMail({
    from,
    to,
    subject: 'Verifikasi email GROUNDHOOD kamu',
    text: `Halo ${name || ''}, verifikasi email kamu dengan membuka link berikut (berlaku 24 jam):\n${link}`,
    html,
  })

  return link
}

export async function sendPasswordResetEmail(to: string, name: string | null, token: string) {
  const link = `${appUrl()}/reset-password?token=${token}`
  const from = process.env.MAIL_FROM || `GROUNDHOOD <${process.env.SMTP_USER}>`

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#1a1a1a;padding:40px 0;color:#d4d2cb">
    <div style="max-width:480px;margin:0 auto;background:#222;border:1px solid #333;border-radius:12px;padding:36px">
      <h1 style="font-size:20px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">GROUNDHOOD</h1>
      <p style="color:#a8a69f;font-size:13px;margin:0 0 24px">Permintaan reset password</p>
      <p style="font-size:14px;line-height:1.6">Halo ${name || 'there'}, kami menerima permintaan untuk mengatur ulang password akunmu.
      Klik tombol di bawah untuk membuat password baru. Link berlaku 1 jam.</p>
      <p style="text-align:center;margin:28px 0">
        <a href="${link}" style="background:#d4d2cb;color:#1a1a1a;text-decoration:none;
           padding:13px 30px;border-radius:100px;font-size:12px;font-weight:700;
           letter-spacing:1.5px;text-transform:uppercase">Reset Password</a>
      </p>
      <p style="font-size:11px;color:#75736d;line-height:1.6">Jika tombol tidak bekerja, salin link ini ke browser:<br>
      <span style="color:#a8a69f;word-break:break-all">${link}</span></p>
      <p style="font-size:11px;color:#75736d;margin-top:24px">Jika kamu tidak meminta reset password, abaikan email ini — passwordmu tidak akan berubah.</p>
    </div>
  </div>`

  await getTransport().sendMail({
    from,
    to,
    subject: 'Reset password akun GROUNDHOOD kamu',
    text: `Halo ${name || ''}, atur ulang password kamu lewat link berikut (berlaku 1 jam):\n${link}\n\nAbaikan email ini jika kamu tidak meminta reset.`,
    html,
  })

  return link
}
