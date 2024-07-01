import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const sanitizeFilename = (filename: string): string => {
  // Normalize the string to decompose diacritics and remove them
  const sanitized = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Separate the base name and extension
  const extensionIndex = sanitized.lastIndexOf('.');
  const baseName = extensionIndex !== -1 ? sanitized.substring(0, extensionIndex) : sanitized;
  const extension = extensionIndex !== -1 ? sanitized.substring(extensionIndex) : '';

  // Replace unwanted characters with underscores, except for the last dot
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/\./g, '_').replace(/\s+/g, '_');

  // Reconstruct the sanitized filename with the original extension
  return sanitizedBaseName + extension;
};

export const onUpload = (file: File) => {
  const sanitizedFilename = sanitizeFilename(file?.name || "image.png");

  const promise = fetch("https://api.meprogram.me:5044/api/blogs/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": sanitizedFilename
    },
    body: file,
  });

  return new Promise((resolve) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as any;
          console.log(url);

          // preload the image
          let image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };

          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error(
            "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.",
          );
          // Unknown error
        } else {
          console.log(res);

          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => e.message,
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
