import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtVol(v: number | null | undefined): string {
  const n = v ?? 0;
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k kg` : `${n.toFixed(0)} kg`;
}
