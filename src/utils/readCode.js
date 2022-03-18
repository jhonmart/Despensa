import Quagga from "quagga";

export const readBarCode = (src, result) =>
  Quagga.decodeSingle(
    {
      inputStream: { size: 1280 },
      locator: { patchSize: "medium", halfSample: true },
      numOfWorkers: 1,
      decoder: { readers: [{ format: "ean_reader", config: {} }] },
      locate: true,
      src
    },
    result
  );
