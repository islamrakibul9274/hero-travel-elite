import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageToCloudinary(fileBase64: string, folder = "hero_travel") {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: "image",
    });
    return { success: true, url: uploadResponse.secure_url, publicId: uploadResponse.public_id };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error?.message || "Upload failed" };
  }
}

export default cloudinary;
