declare module 'downloadjs' {
  const download: (data: Blob | string, filename?: string, mimeType?: string) => void;
  export default download;
}
