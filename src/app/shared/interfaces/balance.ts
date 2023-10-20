export interface Balance {
    'usd-coin'?: number;
    'bitcoin'?: number;
    'ethereum'?: number;
    'binancecoin'?: number;
    'ripple'?: number;
    'solana'?: number;
    'cardano'?: number;
    [key: string]: number | undefined;
  }