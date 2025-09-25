export const makeKey = (files: number[], folders: number[]) =>
  `${files.join("")}${folders.join("")}`;
