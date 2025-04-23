export async function waitForImagesToLoad() {
  const images = Array.from(document.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = img.onerror = () => resolve(true);
          }
        })
    )
  );
}
