const schedule = require("./schedule.json");

module.exports = () => {
  const today = new Date().toLocaleDateString("en-CA",
    { timeZone: "America/Vancouver" });

  return schedule
    .filter((e) => (e.endDate || e.startDate) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
};
