export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}
