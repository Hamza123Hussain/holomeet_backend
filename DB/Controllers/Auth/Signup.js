import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, Storage } from '../../../FireBase_Config.js'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const RegisterUser = async (req, res) => {
  const { Email, Password, UserName } = req.body
  const Image = req.file

  try {
    // Create user with email and password
    const UserMake = await createUserWithEmailAndPassword(auth, Email, Password)

    if (UserMake) {
      let imageurl = ''
      if (Image) {
        const Image_ref = ref(Storage, `images/${UserMake.user.uid}`)
        await uploadBytes(Image_ref, Image.buffer)
        imageurl = await getDownloadURL(Image_ref)
      }

      // Save new user information in Firestore
      await setDoc(doc(db, 'Users', UserMake.user.uid), {
        ID: UserMake.user.uid,
        Email,
        UserName,
        imageurl,
        createdAt: new Date().toISOString(),
      })

      // Send success response
      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          uid: UserMake.user.uid,
          email: Email,
          username: UserName,
          imageurl,
        },
      })
    }
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({
        error: 'Email is already in use. Please try another one.',
      })
    }

    // Handle any other errors
    console.error('Error registering user:', error)
    return res.status(400).json({
      error: error.message || 'Failed to register user',
    })
  }
}
