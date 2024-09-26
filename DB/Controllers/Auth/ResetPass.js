import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../../FireBase_Config.js'

export const ResetPass = async (req, res) => {
  const { Email } = req.body

  try {
    // Send password reset email
    await sendPasswordResetEmail(auth, Email)

    // Send success response
    return res.status(200).json({
      message: `Password reset email sent to ${Email}. Please check your inbox.`,
    })
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        error: 'No user found with this email address.',
      })
    }

    // Handle other potential errors
    console.error('Error sending password reset email:', error)
    return res.status(400).json({
      error: error.message || 'Failed to send password reset email',
    })
  }
}
