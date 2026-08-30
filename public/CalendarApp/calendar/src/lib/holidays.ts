export const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-10": "World Hindi Day",
  "01-12": "National Youth Day",
  "01-15": "Indian Army Day",
  "01-26": "Republic Day",
  "02-14": "Valentine's Day",
  "02-21": "International Mother Language Day",
  "02-28": "National Science Day",
  "03-03": "World Wildlife Day",
  "03-17": "St. Patrick's Day",
  "03-21": "International Day of Forests",
  "04-01": "April Fool's Day",
  "04-07": "World Health Day",
  "04-22": "Earth Day",
  "05-01": "International Labour Day",
  "05-11": "National Technology Day",
  "06-05": "World Environment Day",
  "06-21": "International Day of Yoga",
  "07-01": "National Doctors’ Day",
  "07-04": "Independence Day",
  "07-26": "Kargil Vijay Diwas",
  "08-09": "Quit India Movement Day",
  "08-15": "Independence Day (India)",
  "08-29": "National Sports Day",
  "09-05": "Teachers’ Day (India)",
  "09-14": "Hindi Diwas",
  "10-02": "Gandhi Jayanti",
  "10-16": "World Food Day",
  "10-24": "United Nations Day",
  "10-31": "Halloween",
  "11-11": "National Education Day",
  "11-14": "Children’s Day (India)",
  "11-26": "Constitution Day (Samvidhan Diwas)",
  "12-01": "World AIDS Day",
  "12-04": "Indian Navy Day",
  "12-22": "National Mathematics Day",
  "12-23": "Kisan Diwas",
  "12-24": "Christmas Eve",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve"
};

export function getHoliday(date: Date): string | undefined {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const key = `${month}-${day}`;
  return HOLIDAYS[key];
}