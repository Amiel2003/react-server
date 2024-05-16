import { v4 as uuidv4 } from 'uuid';

export const generateID = () => {
    const fullUUID = uuidv4();
    
    // Extract the first 16 characters (64 bits) from the UUID
    const first64Bits = fullUUID.substring(0, 18);

    return first64Bits;
}

export function generateStrongPassword(length = 12) {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numericChars = "0123456789";
    const specialChars = "!@#$%^&*()_-+=<>?";
    
    const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars;
    
    let password = "";
    
    // Ensure at least one character from each character set
    password += getRandomChar(lowercaseChars);
    password += getRandomChar(uppercaseChars);
    password += getRandomChar(numericChars);
    password += getRandomChar(specialChars);
    
    // Fill the rest of the password with random characters
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }
    
    // Shuffle the password characters for added security
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
  }
  
  function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
  }

