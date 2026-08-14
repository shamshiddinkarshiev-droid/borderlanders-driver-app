import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    const url = file.ufsUrl || file.url || "";

    console.log("DOCUMENT UPLOAD COMPLETE:", {
      name: file.name,
      size: file.size,
      key: file.key,
      url,
      ufsUrl: file.ufsUrl,
      legacyUrl: file.url,
    });

    if (!url) {
      throw new Error(
        `UploadThing did not return a URL for ${file.name}`
      );
    }

    return {
      url,
      fileName: file.name,
      fileSize: file.size,
      fileKey: file.key,
    };
  }),

  photoUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    const url = file.ufsUrl || file.url || "";

    console.log("PHOTO UPLOAD COMPLETE:", {
      name: file.name,
      size: file.size,
      key: file.key,
      url,
      ufsUrl: file.ufsUrl,
      legacyUrl: file.url,
    });

    if (!url) {
      throw new Error(
        `UploadThing did not return a URL for ${file.name}`
      );
    }

    return {
      url,
      fileName: file.name,
      fileSize: file.size,
      fileKey: file.key,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;