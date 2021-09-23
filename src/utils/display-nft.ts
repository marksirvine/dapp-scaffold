import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { decodeMetadata } from "./metaplex-utils";
// import fetch from "node-fetch"
// import {decodeMetadata} from "./metaplex-utils";

const TEST_MINT = "DqGGFuiWRiJ6Mim1qafLWn6FZzBGGcSTyFFSJ8RpuqE8";
const METADATA_PUBKEY = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export async function getNFTImage(
  connection: Connection,
  publicKey: PublicKey
) {
  const programId = {
    programId: TOKEN_PROGRAM_ID,
  };
  // const encoding = {
  //     encoding: "jsonParsed"
  // }
  const result = await connection.getTokenAccountsByOwner(publicKey, programId);

  console.log(`TokenAccountsByOwner: ${JSON.stringify(result.value)}`);
  console.log(
    `TokenAccountsByOwner: ${JSON.stringify(result.value[0].account)}`
  );


  await getNft(TEST_MINT);
  //
  // console.log(`TokenAccountsByOwner: ${result.value}`)
  // console.log(`TokenAccountsByOwner: ${result.context.slot}`)
}

export async function getNft(mintAddress: string) {
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
    console.log(pda.toBase58());

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
    await fetch("https://api.mainnet-beta.solana.com", {
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
        // fetch(m.data.uri).then(
        //     (res) => res.json()).then((data) => {
        //     console.log(data)
        // })
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    console.log(e);
  }
}
