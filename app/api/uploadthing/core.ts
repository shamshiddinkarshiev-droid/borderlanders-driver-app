import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  }, { awaitServerData: false })
  .middleware(() => ({}))
  .onUploadComplete(({ file }) => {
    return { url: file.ufsUrl || file.url };
  }),
  photoUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }, { awaitServerData: false })
  .middleware(() => ({}))
  .onUploadComplete(({ file }) => {
    return { url: file.ufsUrl || file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;