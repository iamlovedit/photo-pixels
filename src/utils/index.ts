export const getImagePixels = (imageSrc: string) => {
  return new Promise((resolve, reject) => {
    if (!imageSrc) {
      reject(new Error("Image source is required"));
      return;
    }
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        width: imageData.width,
        height: imageData.height,
        data: imageData.data,
      });
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
};

export class ImagePixelProcessor {
  imageSrc: string;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  width: number = 0;
  height: number = 0;
  constructor(imageSrc: string) {
    this.imageSrc = imageSrc;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
  }
  loadImage = (): Promise<ImagePixelProcessor> => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
      image.onload = () => {
        if (!this.context) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        this.context.drawImage(image, 0, 0);
        this.width = image.width;
        this.height = image.height;
        resolve(this);
      };
      image.onerror = reject;
      image.src = this.imageSrc;
    });
  };
  getAllPixels = () => {
    if (!this.context) {
      throw new Error("Canvas context is not initialized");
    }
    return this.context.getImageData(0, 0, this.width, this.height);
  };

  getPixelAt = (x: number, y: number) => {
    if (!this.context) {
      throw new Error("Canvas context is not initialized");
    }
    const imageData = this.context.getImageData(x, y, 1, 1);
    const data = imageData.data;
    return {
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3],
    };
  };
}
