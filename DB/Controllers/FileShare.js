// FileShare.js
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Storage } from '../../FireBase_Config.js'

export const FileShare = async (file) => {
  if (!file) {
    throw new Error('No file uploaded.')
  }

  try {
    const Fileref = ref(Storage, `uploads/Files/${file.originalname}`)
    await uploadBytes(Fileref, file.buffer)
    const fileurl = await getDownloadURL(Fileref)
    return fileurl // Return the file URL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}
