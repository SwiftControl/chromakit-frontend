export function applyBrightnessContrast(imageData: ImageData, brightness: number, contrast: number): ImageData {
  const data = imageData.data
  const contrastFactor = (contrast + 100) / 100

  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    data[i] += brightness
    data[i + 1] += brightness
    data[i + 2] += brightness

    // Apply contrast
    data[i] = (data[i] - 128) * contrastFactor + 128
    data[i + 1] = (data[i + 1] - 128) * contrastFactor + 128
    data[i + 2] = (data[i + 2] - 128) * contrastFactor + 128

    // Clamp values
    data[i] = Math.max(0, Math.min(255, data[i]))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1]))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2]))
  }

  return imageData
}

export function applyGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = gray
  }

  return imageData
}

export function applyNegative(imageData: ImageData): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }

  return imageData
}

export function applySepia(imageData: ImageData): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
  }

  return imageData
}

export function applyBinarization(imageData: ImageData, threshold = 128): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    const binary = gray > threshold ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = binary
  }

  return imageData
}

export function calculateHistogram(imageData: ImageData): {
  red: number[]
  green: number[]
  blue: number[]
} {
  const red = new Array(256).fill(0)
  const green = new Array(256).fill(0)
  const blue = new Array(256).fill(0)

  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    red[data[i]]++
    green[data[i + 1]]++
    blue[data[i + 2]]++
  }

  return { red, green, blue }
}

export function blendImages(imageData1: ImageData, imageData2: ImageData, alpha: number): ImageData {
  const data1 = imageData1.data
  const data2 = imageData2.data

  for (let i = 0; i < data1.length; i += 4) {
    data1[i] = data1[i] * alpha + data2[i] * (1 - alpha)
    data1[i + 1] = data1[i + 1] * alpha + data2[i + 1] * (1 - alpha)
    data1[i + 2] = data1[i + 2] * alpha + data2[i + 2] * (1 - alpha)
  }

  return imageData1
}
