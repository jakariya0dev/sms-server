import crypto from "crypto";

// Password complexity requirements
const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijkmnopqrstuvwxyz";
const NUMBERS = "23456789";
const SPECIAL_CHARS = "!@#$%^&*()_-+=";

// Helper function to get a random character from a given string
const randomChar = (chars: string): string =>
  chars.charAt(crypto.randomInt(chars.length));

export const generateRandomPassword = (length = 16): string => {
  // Ensure the requested length meets minimum complexity requirements
  if (length < 8) {
    throw new Error("Password length must be at least 8 characters.");
  }

  // Guarantee at least one character from each set to meet complexity requirements
  const passwordArr: string[] = [
    randomChar(UPPERCASE),
    randomChar(LOWERCASE),
    randomChar(NUMBERS),
    randomChar(SPECIAL_CHARS),
  ];

  const allChars = UPPERCASE + LOWERCASE + NUMBERS + SPECIAL_CHARS;

  // Fill the remaining length with random characters from the combined pool
  for (let i = passwordArr.length; i < length; i++) {
    const randomIndex = crypto.randomInt(0, allChars.length);
    passwordArr.push(allChars.charAt(randomIndex));
  }

  // Shuffle the array using the Fisher-Yates algorithm for unbiased randomness
  for (let i = passwordArr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    const temp = passwordArr[i]!;
    passwordArr[i] = passwordArr[j]!;
    passwordArr[j] = temp;
  }

  return passwordArr.join("");
};
