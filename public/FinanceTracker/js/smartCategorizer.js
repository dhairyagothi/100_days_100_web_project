// js/smartCategorizer.js

export const autoCategorize = (
  description
) => {

  const text =
    description.toLowerCase();

  if (
    text.includes("uber") ||
    text.includes("ola")
  ) {

    return "travel";
  }

  if (
    text.includes("pizza") ||
    text.includes("burger") ||
    text.includes("restaurant")
  ) {

    return "food";
  }

  if (
    text.includes("netflix") ||
    text.includes("spotify")
  ) {

    return "entertainment";
  }

  if (
    text.includes("amazon") ||
    text.includes("shopping")
  ) {

    return "shopping";
  }

  return "other";
};