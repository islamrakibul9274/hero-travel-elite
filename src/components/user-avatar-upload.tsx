"use client";

import React, { useState } from "react";
import { Camera, Loader2, Check, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function UserAvatarUpload({
  currentAvatar,
  onAvatarUpdated,
}: {
  currentAvatar?: string;
  onAvatarUpdated?: (newUrl: string) => void;
}) {
  const { data: session, update: updateSession } = useSession();
  const [avatar, setAvatar] = useState(currentAvatar || session?.user?.image || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploading(true);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, folder: "hero_travel_avatars" }),
        });

        const data = await res.json();
        if (data.success && data.url) {
          setAvatar(data.url);
          if (onAvatarUpdated) onAvatarUpdated(data.url);
          await updateSession({ image: data.url });
          toast.success("Profile photo updated successfully!");
        } else {
          toast.error(data.error || "Failed to upload image.");
        }
      } catch (err) {
        toast.error("Network error during image upload.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative group">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500/30 shadow-md bg-slate-100 flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="text-xl font-bold text-slate-400">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        {/* Upload Overlay Button */}
        <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900">Profile Photo</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Uploaded directly to Cloudinary CDN. Max 5MB.
        </p>
        <label className="inline-block mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer">
          {uploading ? "Uploading..." : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}

export default UserAvatarUpload;
