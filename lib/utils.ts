import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5)
}


export function formatUrl(url: string) {
  const cleanUrl = url.replace(/^https?:\/\//, "")
  const pagePath = cleanUrl.split("/")[1].toLowerCase().trim().replace(/\//g, "").replace(/\s+/g, "-");

  console.log("pagePath", pagePath);

  if(pagePath === "" || pagePath === "index" || pagePath === "/") {
    return "Homepage"
  }


  return `/${pagePath}`;
}