export const tweetDate = (isoDateString) => {
  const date = new Date(isoDateString);

  const timeFormatter = new Intl.DateTimeFormat("es-ES", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const dateFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeString = timeFormatter.format(date);
  const dateString = dateFormatter.format(date);
  return `${timeString} · ${dateString}`;
};
