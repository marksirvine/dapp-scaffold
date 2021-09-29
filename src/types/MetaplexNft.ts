export interface MetaplexNft {
    attributes: any,
    collection: string,
    description: string,
    image: string,
    name: string,
    properties: {
        category: string,
        creators: [{
            address: string,
            share: number
        }],
        files: [
            {
                type: string,
                uri: string,
            }
        ]
    },
    seller_fee_basis_points: number,
    symbol: string
}
