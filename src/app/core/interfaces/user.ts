export interface User {
    email: string,
    password: string,
    username: string,
    avatar?: string,
    balance?: {
        'usd-coin'?: number,
        'bitcoin'?: number,
        'ethereum'?: number,
        'binancecoin'?: number,
        'ripple'?: number,
        'solana'?: number,
        'cardano'?: number,
    },
    id?: number
}
