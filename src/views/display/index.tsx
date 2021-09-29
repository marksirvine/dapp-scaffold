import React, {useCallback, useState} from "react";
import { useConnection } from "../../contexts/connection";
import { notify } from "../../utils/notifications";
import { ConnectButton } from "../../components/ConnectButton";
import { LABELS } from "../../constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { getNft, getNFTImage } from "../../utils/display-nft";
import { PublicKey } from "@solana/web3.js";
import {MetaplexNft} from "../../types/MetaplexNft";
import {Image} from 'antd'

interface NftState {
  nft: MetaplexNft | null;
  isLoading: boolean;
  error: null | any
}
export const DisplayView = () => {
  const [state, setState] = useState<NftState>({nft: null, isLoading: false, error: null})
  const connection = useConnection();
  const { publicKey } = useWallet();

  const handleDisplay = useCallback(async () => {
    setState({...state, isLoading: true, error: null})
    try {
      if (!publicKey) {
        return;
      }
      const nft: MetaplexNft = await getNFTImage(connection, publicKey);
      setState({...state, nft,  isLoading: false})

      } catch (error) {
      setState({...state, isLoading: false, error: error})
      notify({
          message: LABELS.AIRDROP_FAIL,
          type: "error",
      });
      console.error(error);
    }
  }, [publicKey, connection, state]);

  return (
      <div className="flexColumn" style={{ flex: 1 }}>
        <div>
          <div className="deposit-input-title" style={{ margin: 10 }}>
            {LABELS.DISPLAY}
          </div>
          <ConnectButton type="primary" onClick={handleDisplay}>
            {LABELS.DISPLAY_NFT}
          </ConnectButton>
          {state.isLoading && <p>Please wait...</p>}
          {state.src && <Image src={state.src} width={200} alt='nft-image' />}
        </div>
      </div>
  );
};


















