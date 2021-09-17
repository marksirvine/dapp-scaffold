import React, { useCallback } from "react";
import { useConnection } from "../../contexts/connection";
import { notify } from "../../utils/notifications";
import { ConnectButton } from "../../components/ConnectButton";
import { LABELS } from "../../constants";
import { useWallet } from "@solana/wallet-adapter-react";
import {mintNFT} from "../../utils/mint-nft";

export const MintView = () => {
    const connection = useConnection();
    const { publicKey } = useWallet();

    const handleRequestAirdrop = useCallback(async () => {
        try {
            if (!publicKey) {
                return;
            }
            await mintNFT(connection, publicKey)
            console.log("NFT minted")
            //TODO Mint nft
            notify({
                message: LABELS.NFT_MINTED,
                type: "success",
            });
        } catch (error) {
            notify({
                message: LABELS.AIRDROP_FAIL,
                type: "error",
            });
            console.error(error);
        }
    }, [publicKey, connection]);

    return (
        <div className="flexColumn" style={{ flex: 1 }}>
            <div>
                <div className="deposit-input-title" style={{ margin: 10 }}>
                    {LABELS.MINT}
                </div>
                <ConnectButton type="primary" onClick={handleRequestAirdrop}>
                    {LABELS.GIVE_NFT}
                </ConnectButton>
            </div>
        </div>
    );
};
