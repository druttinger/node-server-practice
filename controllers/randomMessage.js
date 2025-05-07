const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Kristie"];
const messages = [
  "Hello, world!",
  "How are you?",
  "Goodbye!",
  "Have a great day!",
  "See you later!",
  "Welcome to the chat!",
  "What's your favorite color?",
  "Do you like pizza?",
  "Tell me a joke!",
  "What's your hobby?",
];
const kMessages = [
  "I love you, David!",
  "I need a cnug.",
  "I need a CNUG, NOW!",
  "You're such a weirdo, David.",
  "It depends.",
  "It's good for digestion.",
  "Honeybear, you are the best dog ever!",
  "For the best massage of your life call 1-800-555-5555.",
];

exports.randomMessage = (kristieMode = false) => {
  const randomName = kristieMode
    ? "Kristie"
    : names[Math.floor(Math.random() * names.length)];
  const randomMessage =
    randomName === "Kristie"
      ? kMessages[Math.floor(Math.random() * messages.length)]
      : messages[Math.floor(Math.random() * messages.length)];
  return { author: randomName, message: randomMessage };
};
