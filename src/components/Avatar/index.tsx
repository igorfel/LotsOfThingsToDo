import { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";

interface AvatarUploadProps {
  url: string | null;
  size: number;
}

export default function AvatarUpload({ url, size }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  return (
    <div style={{ width: size }} aria-live="polite">
      <img
        src={avatarUrl ? avatarUrl : `https://place-hold.it/${size}x${size}`}
        alt={avatarUrl ? "Avatar" : "Sem imagem"}
        className="avatar image"
        style={{ height: size, width: size, borderRadius: "50%" }}
      />
    </div>
  );
}
