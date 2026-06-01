// js/notificationManager.js

export const showNotification = (
  message
) => {

  const toast =
    document.createElement("div");

  toast.className =
    "toast-notification";

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {

    toast.remove();

  }, 3000);
};