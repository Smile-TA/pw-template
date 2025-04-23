export async function scrollToBottom() {
  await new Promise<void>((resolve) => {
    let totalHeight = 0;
    const distance = 500;
    const delay = 100;

    const timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
      if (totalHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, delay);
  });
}
