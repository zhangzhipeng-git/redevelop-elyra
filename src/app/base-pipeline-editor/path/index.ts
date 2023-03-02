export default {
  extname: (filename: string) => {
    if (!filename || filename.indexOf('.') < 0) return '';

    const lastDotIndex = filename.lastIndexOf('.');
    return filename.slice(-(filename.length - lastDotIndex));
  },
  basename: (filepath: string, extension?: string) => {
    if (!filepath) return '';

    const dirs = filepath.split(/\/|\\/);
    const filename = dirs.pop() || '';

    if (!extension) return filename;

    extension = extension[0] === '.' ? extension : `.${extension}`;
    const index = filename.indexOf(extension);

    if (index < 0) return filename;
    if (extension[extension.length - 1] !== filename[filename.length - 1])
      return filename;

    return filename.substring(0, index);
  }
};
