import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    const url = file.ufsUrl || file.url || "";

    console.log("DOCUMENT UPLOAD:", {
      name: file.name,
      url,
      ufsUrl: file.ufsUrl,
      legacyUrl: file.url,
    });

    return {
      url,
      ufsUrl: file.ufsUrl || "",
    };
  }),

  photoUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    const url = file.ufsUrl || file.url || "";

    console.log("PHOTO UPLOAD:", {
      name: file.name,
      url,
      ufsUrl: file.ufsUrl,
      legacyUrl: file.url,
    });

    return {
      url,
      ufsUrl: file.ufsUrl || "",
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;