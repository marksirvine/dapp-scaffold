import React, { useCallback } from "react";
import { useConnection } from "../../contexts/connection";
import { notify } from "../../utils/notifications";
import { ConnectButton } from "../../components/ConnectButton";
import { LABELS } from "../../constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { getNft, getNFTImage } from "../../utils/display-nft";
import { PublicKey } from "@solana/web3.js";

export const DisplayView = () => {
  const connection = useConnection();
  const { publicKey } = useWallet();

  const handleDisplay = useCallback(async () => {
    try {
      if (!publicKey) {
        return;
      }
      const img = await getNFTImage(connection, publicKey);

      console.log("NFT displayed");
      //TODO Mint nft
      // notify({
      //     message: LABELS.NFT_MINTED,
      //     type: "success",
      // });
    } catch (error) {
      // notify({
      //     message: LABELS.AIRDROP_FAIL,
      //     type: "error",
      // });
      console.error(error);
    }
  }, [publicKey, connection]);

  return (
    <div className="flexColumn" style={{ flex: 1 }}>
      <div>
        <div className="deposit-input-title" style={{ margin: 10 }}>
          {LABELS.DISPLAY}
        </div>
        <ConnectButton type="primary" onClick={handleDisplay}>
          {LABELS.DISPLAY_NFT}
        </ConnectButton>
      </div>
    </div>
  );
};
