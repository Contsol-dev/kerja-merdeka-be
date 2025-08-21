export const pdfCache = new Map<string, Uint8Array<ArrayBufferLike>>();

export function makeCacheKey(
  userId: string,
  jobDataId: string,
  resultType: "cv" | "coverLetter" | "summary"
): string {
  return `${userId}-${jobDataId}-${resultType}`;
}
