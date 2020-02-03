import * as mime from 'mime';

export async function guessContentType(fileName: string, blob?: Blob | string, defaultType = 'text/turtle'): Promise<string> {
  const extType = mime.getType(fileName)
  if (extType)
    return extType;
  if (blob instanceof Blob) {
    const blobType = await guessFromBlob(blob);
    if (blobType)
      return blobType;
  }
  return defaultType;
};

export function guessFromBlob(blob: Blob): Promise<string | undefined> {
  const fileReader = new FileReader();
  return new Promise(resolve => {
    fileReader.onloadend = e => {
      if (e && e.target && e.target.readyState === FileReader.DONE) {
        const arr = new Uint8Array(e.target.result as ArrayBuffer);
        let header = '';
        for (let i = 0; i < arr.length; i++)
          header += arr[i].toString(16);
        resolve(magicNumberToMime(header))
      }
    };
    fileReader.readAsArrayBuffer(blob.slice(0, 4));
  });
}

// TODO: Add more magic numbers
// See https://en.wikipedia.org/wiki/List_of_file_signatures
function magicNumberToMime(num: string): string | undefined {
  switch (num) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
  }
  return undefined;
}
