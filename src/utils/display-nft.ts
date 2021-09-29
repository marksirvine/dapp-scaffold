import {
    Connection,
    GetProgramAccountsConfig,
    ParsedAccountData,
    PublicKey
} from "@solana/web3.js";
import {Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {decodeMetadata} from "./metaplex-utils";
import {MetaplexNft} from "../types/MetaplexNft";

const TEST_MINT = "DqGGFuiWRiJ6Mim1qafLWn6FZzBGGcSTyFFSJ8RpuqE8";
const METADATA_PUBKEY = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export async function getNFTImage(
    connection: Connection,
    publicKey: PublicKey
):Promise<MetaplexNft> {
    const programId = {
        programId: TOKEN_PROGRAM_ID,
    };

    const config: GetProgramAccountsConfig = {
        filters: [
            {
                "memcmp": {
                    "offset": 32,
                    "bytes": publicKey.toString()
                }
            },
            {
                "dataSize": 165
            }
        ]
    }
    const programAccounts = await connection.getParsedProgramAccounts(programId.programId, config);

    // console.log(`ParsedProgramAccounts: ${JSON.stringify(programAccounts)}`);

    const parsedAccountData: ParsedAccountData = programAccounts[0].account.data as ParsedAccountData
    const mint = parsedAccountData.parsed.info.mint

    console.log(`mint : ${JSON.stringify(mint)}`);
    const nft:MetaplexNft = await getNft(mint);
    console.log(JSON.stringify(nft, null, 2))
    return nft;
}

export async function getNft(mintAddress: string): Promise<any> {
    try {
        // input mint here
        let address = new PublicKey(mintAddress);
        let [pda, bump] = await PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                METADATA_PUBKEY.toBuffer(),
                new PublicKey(address).toBuffer(),
            ],
            METADATA_PUBKEY
        );
        // console.log(pda.toBase58());

        const data = {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [
                pda.toBase58(),
                {
                    encoding: "base64",
                },
            ],
        };
        return await fetch("https://api.mainnet-beta.solana.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data: any) => {
                let buf = Buffer.from(data.result.value.data[0], "base64");
                let m = decodeMetadata(buf);
                // console.log(m)
                return fetch(m.data.uri).then(
                    (res) => res.json()).then((data) => {
                    // console.log(data)
                    return data
                })
            })
            .catch((e) => {
                console.log(e);
            });
    } catch (e) {
        console.log(e);
    }
}
