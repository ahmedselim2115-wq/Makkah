export function getContainedImageRect(
  containerW: number,
  containerH: number,
  naturalW: number,
  naturalH: number
) {
  const containerRatio = containerW / containerH;
  const imageRatio = naturalW / naturalH;

  let width: number, height: number;
  if (imageRatio > containerRatio) {
    width = containerW;
    height = containerW / imageRatio;
  } else {
    height = containerH;
    width = containerH * imageRatio;
  }

  return {
    left: (containerW - width) / 2,
    top: (containerH - height) / 2,
    width,
    height,
  };
}