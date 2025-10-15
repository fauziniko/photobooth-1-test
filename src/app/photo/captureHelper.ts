// Helper file untuk handle capture sederhana
export const handleCaptureSimple = (
  photoDataUrl: string,
  photos: string[],
  photoFileNames: string[],
  layout: number,
  setPhotos: (photos: string[]) => void,
  setPhotoFileNames: (names: string[]) => void,
  setShowEditMode: (show: boolean) => void,
  setShowCamera: (show: boolean) => void,
  setIsUploadingPhoto: (loading: boolean) => void
) => {
  try {
    setIsUploadingPhoto(true);
    console.log('📸 Photo captured, saving to browser cache...');
    
    // Simpan langsung ke state sebagai base64
    const newPhotos = [...photos, photoDataUrl];
    const newFileNames = [...photoFileNames, '']; // Empty untuk base64
    
    setPhotos(newPhotos);
    setPhotoFileNames(newFileNames);
    console.log('✅ Photo saved to browser cache:', newPhotos.length);
    
    // Jika semua foto sudah diambil, masuk ke edit mode
    if (newPhotos.length >= layout) {
      setShowEditMode(true);
      setShowCamera(false);
    }
  } catch (error) {
    console.error('❌ Error saving photo:', error);
    alert('Failed to save photo. Please try again.');
  } finally {
    setIsUploadingPhoto(false);
  }
};
