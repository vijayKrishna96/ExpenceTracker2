export const getLast7Days = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i); // Subtract i days to get previous days
    result.push({
      day: daysOfWeek[date.getDay()],
      date: date.toISOString().split("T")[0],
      income: 0,
      expense: 0,
    });
  }

  return result.reverse();
};

export const getLast12Months = () => {
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthName = monthsOfYear[date.getMonth()];
    const shortYear = date.getFullYear().toString().slice(-2);
    
    const formattedMonthYear = `${monthName} ${shortYear}`;
    const formatedDate = date.toISOString().split("T")[0];

    result.push({
      month: formattedMonthYear,
      fullDate: formatedDate,
      income: 0,
      expense: 0,
    });
  }

  // Return in chronological order (oldest to newest)
  return result.reverse();
};

export const getYearRange = (startYear: number , endYear:number):any => {
  const result = [];

  for(let year = startYear; year <= endYear; year++){
    result.push({
      year: year.toString(),
      fullDate: `01-01-${year}`,
      income: 0,
      expense: 0,
    });
}

  return result.reverse();
};