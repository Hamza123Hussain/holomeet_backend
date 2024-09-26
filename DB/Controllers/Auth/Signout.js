import { signOut } from 'firebase/auth'
import { auth } from '../../../FireBase_Config.js'

export const Signout = async (req, res) => {
  try {
    // Sign out the user
    await signOut(auth)

    // Send success response
    return res.status(200).json({
      message: 'User signed out successfully.',
    })
  } catch (error) {
    // Handle potential errors
    console.error('Error signing out:', error)
    return res.status(400).json({
      error: error.message || 'Failed to sign out',
    })
  }
}
