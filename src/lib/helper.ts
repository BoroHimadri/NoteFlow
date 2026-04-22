export const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
