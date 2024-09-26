import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../FireBase_Config.js'
import { doc, getDoc } from 'firebase/firestore'

export const SignIn = async (req, res) => {
  const { Email, Password } = req.body

  try {
    // Sign in the user with email and password
    const UserExist = await signInWithEmailAndPassword(auth, Email, Password)

    if (UserExist) {
      // Fetch user data from Firestore
      const GetUserData = await getDoc(doc(db, 'Users', UserExist.user.uid))

      if (GetUserData.exists()) {
        return res.status(200).json(GetUserData.data())
      } else {
        return res
          .status(404)
          .json({ error: 'User data not found in database.' })
      }
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        error: 'No user found with this email. Please sign up first.',
      })
    }

    if (error.code === 'auth/wrong-password') {
      return res.status(400).json({
        error: 'Incorrect password. Please try again.',
      })
    }

    // Handle other potential errors
    console.error('Error signing in user:', error)
    return res.status(400).json({
      error: error.message || 'Failed to sign in user',
    })
  }
}
