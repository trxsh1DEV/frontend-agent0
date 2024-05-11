export const formatDateString = (dateString: string | undefined) => {
  if (!dateString) return;
  return new Date(dateString).toLocaleString().replace(/,/g, "");
};
