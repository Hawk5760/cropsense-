export interface PreparedPlantImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
  fileName: string;
  file: File;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MiB (8,388,608 bytes)

export function validatePlantImageFile(file: File): 'invalidImageType' | 'imageTooLarge' | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'invalidImageType';
  }
  if (file.size > MAX_BYTES) {
    return 'imageTooLarge';
  }
  return null;
}

export function dataUrlToFile(dataUrl: string, fileName: string, mimeType = 'image/jpeg'): File {
  const parts = dataUrl.split(',');
  const base64 = parts[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], fileName, { type: mimeType });
}

export function preparePlantImageFile(file: File): Promise<PreparedPlantImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const commaIndex = dataUrl.indexOf(',');
      if (commaIndex === -1) {
        reject(new Error('Failed to parse uploaded image data.'));
        return;
      }
      resolve({
        dataUrl,
        base64: dataUrl.slice(commaIndex + 1),
        mimeType: file.type || 'image/jpeg',
        fileName: file.name,
        file,
      });
    };
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.readAsDataURL(file);
  });
}
