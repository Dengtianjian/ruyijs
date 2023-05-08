const fileRender: FileReader = new FileReader();

export function renderImage(file: File): Promise<string> {
  fileRender.readAsDataURL(file);
  return new Promise((resolve) => {
    fileRender.onloadend = fr => {
      resolve(fr.target?.result as string);
    }
  })

}