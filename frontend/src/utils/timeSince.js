export const timeSince = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = Math.floor(seconds / 31536000); // 1 año en segundos

  // Si el año es diferente (tweet del año pasado o más), muestra la fecha completa con el año.
  if (now.getFullYear() !== date.getFullYear()) {
    return date.toLocaleDateString("default", {
      day: "numeric",
      month: "short" + ".",
      year: "numeric",
    });
  }

  // Si ha pasado más de un día
  interval = Math.floor(seconds / 86400); // 1 día en segundos
  if (interval >= 1) {
    return (
      date.getDate() +
      " " +
      date.toLocaleString("default", { month: "short" }) +
      "."
    );
  }

  // Si ha pasado más de una hora
  interval = Math.floor(seconds / 3600); // 1 hora en segundos
  if (interval >= 1) {
    return interval + "h";
  }

  // Si ha pasado más de un minuto
  interval = Math.floor(seconds / 60); // 1 minuto en segundos
  if (interval >= 1) {
    return interval + "min";
  }

  // Si ha pasado menos de un minuto
  return Math.floor(seconds) + "s";
};
