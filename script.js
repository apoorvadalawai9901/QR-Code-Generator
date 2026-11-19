const form = document.getElementById("generator-form");
const input = document.getElementById("qr-input");
const errorMessage = document.getElementById("error-message");
const emptyState = document.getElementById("empty-state");
const qrOutput = document.getElementById("qr-output");
const qrCodeElement = document.getElementById("qr-code");
const downloadButton = document.getElementById("download-button");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const content = input.value.trim();
  if (!content) {
    showError("Please enter some text or a website URL.");
    input.focus();
    return;
  }

  if (typeof QRCode === "undefined") {
    showError("The QR code library could not be loaded. Check your internet connection and try again.");
    return;
  }

  try {
    qrCodeElement.replaceChildren();
    new QRCode(qrCodeElement, {
      text: content,
      width: 144,
      height: 144,
      colorDark: "#17201d",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    emptyState.hidden = true;
    qrOutput.hidden = false;
    downloadButton.href = getPngDataUrl();
    downloadButton.setAttribute("aria-disabled", "false");
    showError("");
  } catch (error) {
    showError("A QR code could not be created. Please try different text.");
  }
});

downloadButton.addEventListener("click", (event) => {
  if (downloadButton.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    return;
  }

  const dataUrl = getPngDataUrl();
  if (!dataUrl) {
    event.preventDefault();
    showError("The QR code image is not ready to download. Please generate it again.");
    return;
  }

  downloadButton.href = dataUrl;
});

function getPngDataUrl() {
  const canvas = qrCodeElement.querySelector("canvas");
  if (canvas) {
    return canvas.toDataURL("image/png");
  }

  const image = qrCodeElement.querySelector("img");
  return image && image.src.startsWith("data:image/png") ? image.src : "";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = !message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}
