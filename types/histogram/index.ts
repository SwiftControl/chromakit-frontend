export interface HistogramResponseGrayscale {
  histogram: {
    gray: number[];
  };
}

export interface HistogramResponseColor {
  histogram: {
    red: number[];
    blue: number[];
    green: number[];
  };
}

export type HistogramData = HistogramResponseGrayscale | HistogramResponseColor;
