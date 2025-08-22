export const formatEnumText = (text: string) => {
  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase().replace(/_/g, " ")
  );
};

export const toPlainText = (html: string) => {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};
