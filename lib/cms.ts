import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "content");

export function getFileContent(filePath: string) {
  const fullPath = path.join(contentDirectory, filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(fileContents);
}

export function getCollectionItems(folderPath: string) {
  const fullPath = path.join(contentDirectory, folderPath);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  const fileNames = fs.readdirSync(fullPath);
  const items = fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(fullPath, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      return {
        slug: fileName.replace(/\.json$/, ""),
        ...JSON.parse(fileContents),
      };
    });
  
  // Sort by order if available
  return items.sort((a, b) => (a.order || 0) - (b.order || 0));
}
