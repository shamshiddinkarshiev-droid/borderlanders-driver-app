import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
  .middleware(() => ({ uploadedBy: "driver" }))
  .onUploadComplete(async ({ file }) => {
    console.log("File uploaded:", file.url);
    return { url: file.url };
  }),
  photoUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
  .middleware(() => ({ uploadedBy: "driver" }))
  .onUploadComplete(async ({ file }) => {
    console.log("Photo uploaded:", file.url);
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;