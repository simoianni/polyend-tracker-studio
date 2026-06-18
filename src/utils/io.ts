import { nextTick } from 'vue';

export function requestFiles(accept?: string, multiple?: boolean): Promise<FileList | File | null | undefined> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept || 'audio/wav';
    input.multiple = multiple || false;
    input.style.display = 'none';
    input.oninput = () => {
      const files = input.files;
      document.body.removeChild(input);
      resolve(multiple ? files : files?.[0]);
    };
    input.oncancel = () => {
      document.body.removeChild(input);
      reject(null);
    };

    document.body.appendChild(input);
    nextTick(() => {
      input.click();
    });
  });
}

export async function downloadFile(filename: string, data: Blob) {
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
