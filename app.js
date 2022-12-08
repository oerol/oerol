const animationDuration = 400;
const animationOffset = 100;

async function handleWelcomeMessage() {
  await new Promise((r) => setTimeout(r, animationDuration * 4 + animationOffset));

  let welcomeTextElement = document.getElementById("welcome-text");
  let cursor = document.getElementById("cursor");
  let welcomeText = "Willkommen!";

  cursor.classList.remove("blinking");
  for (let i = 0; i < welcomeText.length; i++) {
    let character = welcomeText.charAt(i);
    console.log(character);
    welcomeTextElement.innerHTML += character;
    await new Promise((r) => setTimeout(r, 90 - i * 5)); // increasingly types faster
  }
  cursor.classList.add("blinking");

  await new Promise((r) => setTimeout(r, animationDuration * 5 + animationOffset));
  cursor.remove();
}

window.onload = function () {
  handleWelcomeMessage();
};
