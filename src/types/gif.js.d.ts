declare module 'gif.js' {
  class GIF {
    constructor(options?: object);
    addFrame(image: HTMLCanvasElement | HTMLImageElement, options?: object): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: string, callback: (...args: never[]) => void): void;
    render(): void;
    abort(): void;
  }
  export default GIF;
}
