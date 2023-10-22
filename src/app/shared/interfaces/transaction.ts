export interface Transaction {
    userId: number | undefined,
    fromCurrency: string,
    toCurrency: string,
    amountFrom: number,
    amountTo: number,
    id?: number
}

export interface Sent {
    userId: number | undefined,
    currency: string,
    amount: number,
    toEmail: string,
    id?: number
}

