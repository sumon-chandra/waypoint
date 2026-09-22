import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { cookies } from "next/headers";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token || isTokenExpired(token)) {
          throw new UploadThingError(
            "Unauthorized: Please sign in to upload an avatar",
          );
        }

        const decoded = decodeJwt(token);
        return { userId: decoded?.id || decoded?.userId || "user" };
      } catch (err) {
        if (err instanceof UploadThingError) throw err;
        throw new UploadThingError("Authentication error during upload");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log({ file, metadata });
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl || file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
