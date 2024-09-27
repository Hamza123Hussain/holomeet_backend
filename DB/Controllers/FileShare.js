import { upload } from '../../MulterConfig.js'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Storage } from '../../FireBase_Config.js'
export const FileShare =
  (upload.single('File'),
  async (req, res) => {
    const File = req.file
    if (File) {
      let fileurl = ''
      const Fileref = ref(Storage, `uploads/Files/${File.originalname}`)
      await uploadBytes(Fileref, File.buffer)
      fileurl = await getDownloadURL(Fileref)
      return fileurl
    } else {
      return ''
    }
  })
