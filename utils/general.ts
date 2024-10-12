import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string) => {
  const parsedDate = parseISO(dateString);
  const formattedDate = format(parsedDate, "MMMM d, yyyy h:mm a");

  return formattedDate;
};
