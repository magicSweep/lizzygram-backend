export const regex = (value: string, options: { pattern: RegExp }) => {
  if (value === "") return true;

  if (options.pattern === undefined) throw new Error("No pattern...");

  const match = value.match(options.pattern);

  if (match === null || match[0] !== value) {
    return false;
  }

  return true;
};

// maxFileSizeMB - use fs.statSync

// isValidFileFormat - use sharp to check format

// max - file size in MB, value - file size in bytes
export const isLessThanMaxFileSizeMB = (max: number, val: number) =>
  fromBytesToMB(val) <= max;

// @type - MIME type like image/jpeg or application/json
export const isValidFileFormat = (formats: string[], type: string) => {
  const format = type.split("/")[1];

  return formats.includes(format);
};

export const fromBytesToMB = (bytes: number) => {
  if (bytes === 0) return 0;

  return bytes / (1024 * 1024);
};

export const hasTrueValue = (obj: any) => {
  for (let prop in obj) {
    if (obj[prop] === true) return true;
  }

  return false;
};
