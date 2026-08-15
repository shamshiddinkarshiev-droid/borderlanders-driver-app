import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";

const f = createUploadthing();

const getFileUrl = (file: {
  ufsUrl?: string | null;
  url?: string | null;
}) => {
  return file.ufsUrl || file.url || "";
};

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
    const url = getFileUrl(file);

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
        `UploadThing returned no usable URL for ${file.name}`
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
    const url = getFileUrl(file);

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
        `UploadThing returned no usable URL for ${file.name}`
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