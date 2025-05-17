declare module 'gif.js' {
  class GIF {
    constructor(options?: object);
    addFrame(image: HTMLCanvasElement | HTMLImageElement, options?: object): void;
    on(event: string, callback: (blob: Blob) => void): void;
    render(): void;
  }
  export default GIF;
}