export const formatEnumText = (text: string) => {
  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase().replace(/_/g, " ")
  );
};
