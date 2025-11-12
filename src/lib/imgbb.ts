// ImgBB Image Upload Utility
// Get your API key from: https://api.imgbb.com/

export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

  if (!apiKey) {
    throw new Error('ImgBB API key is not configured. Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env file')
  }

  try {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('key', apiKey)

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to upload image')
    }

    const data = await response.json()
    
    if (data.success && data.data.url) {
      return data.data.url // Returns the direct URL to the uploaded image
    } else {
      throw new Error('Invalid response from ImgBB')
    }
  } catch (error) {
    console.error('ImgBB upload error:', error)
    throw error
  }
}

export async function uploadMultipleToImgBB(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadToImgBB(file))
  return Promise.all(uploadPromises)
}
