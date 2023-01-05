import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadSpinner from "./../components/LoadSpinner";
import { useContract } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";

let moment = require("moment-timezone");

export default function Home() {
  const CONTRACT = "0x636D5A5229Fe396e4087B80d32188B9a6DbeA970";
  const CONTENT_NFT = "0xda2ec25b733fa79af72277b920639bbb30716164:23:Polygon";

  const { contract, isLoading, error } = useContract(
    CONTRACT,
    "nft-collection"
  );

  const [isMinting, setIsMinting] = useState(false);
  const [mintedNft, setMintedNft] = useState({});
  const wallet = useAddress();
  const isConnected = !!wallet;

  const mint5MinAccess = () => {
    try {
      mintNft(
        "Buddy 5 Minutes Access",
        "This NFT grants the owner 5 minutes of access to unlockable content associated with the BUDDY NFT  After 5 minutes, access will be expired but this NFT will stay in your wallet as a receipt.",
        "https://arweave.net/3caPXeJc_68rFkVu487RU-_0Vh1YiCEi0_00o3O-kZc",
        "5minutes"
      );
    } catch (e) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mint10MinAccess = () => {
    try {
      mintNft(
        "Buddy 10 Minutes Access",
        "This NFT grants the owner 10 minutes of access to unlockable content associated with the BUDDY NFT  After 10 minutes, access will be expired but this NFT will stay in your wallet as a receipt.",
        "https://arweave.net/Mslj9-Lvi0QKDbnRrBzghDnBgpik0PD012_wM23xYdo",
        "10minutes"
      );
    } catch (e) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mint30MinAccess = () => {
    try {
      mintNft(
        "Buddy 30 Minutes Access",
        "This NFT grants the owner 30 minutes of access to unlockable content associated with the BUDDY NFT  After 30 minutes, access will be expired but this NFT will stay in your wallet as a receipt.",
        "https://arweave.net/AZHYy3xjZYvLWYEPJxZi_36G1lX9b-rOf3KDAAQOJ14",
        "30minutes"
      );
    } catch (e) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mintNft = async (name, description, fileUrl, duration) => {
    try {
      if (isLoading) return;
      setIsMinting(true);

      const durationMinutes = [
        { key: "5minutes", seconds: 5 },
        { key: "10minutes", seconds: 10 },
        { key: "30minutes", seconds: 30 },
      ];

      console.log(wallet);

      const expireTime = durationMinutes.find(
        (timeframe) => timeframe.key === duration
      );
      const expireDate = moment
        .tz(new Date(), "America/New_York")
        .add(expireTime?.seconds, "minutes")
        .format("MM/DD/YYYY HH:mma z");
      const expireMsg = `Access to the unlockables expires at ${expireDate}.`;

      description = `${description} ${expireMsg}`;

      // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
      const metadata = {
        name,
        description,
        image: fileUrl,
        attributes: [
          {
            trait_type: "content-nft",
            value: CONTENT_NFT,
          },
          {
            trait_type: "monetization-type",
            value: `rental:${duration}`,
          },
          {
            trait_type: "creation-date",
            value: `${Math.round(Date.now() / 1000)}`,
          },
        ],
      };

      const tx = await contract.mintTo(wallet, metadata);
      const receipt = tx.receipt; // the transaction receipt
      const tokenId = tx.id; // the id of the NFT minted
      const nft = await tx.data(); // (optional) fetch details of minted NFT

      alert(
        `SUCCESS.  Please visit app.darkblock.io to consume your unlockables. ${CONTRACT}:${tokenId}`
      );
      setIsMinting(false);
      if (nft && nft.metadata && nft.metadata.id) setMintedNft(nft);
    } catch (err) {
      console.error(err);
      alert("Error minting NFT! : " + err?.message);
      setIsMinting(false);
    }
  };
  return (
    <>
      <nav className="flex-shrink-0 bg-black">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center px-2 lg:px-0 xl:w-64">
              <div className="flex-shrink-0 ml-8">
                <img
                  className="h-8 w-auto"
                  src="https://app.darkblock.io/images/footericon.svg"
                  alt="Darkblock"
                />
              </div>
              <div className="right-0 absolute">
                <ConnectWallet
                  auth={{
                    loginConfig: {
                      // Function to run on error.
                      onError: (error) => console.log(error),
                    },
                  }}
                />
                ;
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="w-full mx-auto my-12 flex flex-wrap overflow-hidden grid-cols-3 justify-center items-center">
          <div className="w-full md:w-1/3 px-2 rounded">
            <Image
              className="mx-auto mt-0 mb-8 md:mt-8 md:mb-0"
              src="/DARKBLOCKSTER.svg"
              alt="Darkblockster"
              width={400}
              height={300}
              layout="responsive"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 rounded">
            <a
              className="cursor-pointer"
              href="https://app.darkblock.io/platform/sol/nft/FbNXShA3EPQawwSMLfHGcHvSyNZfti8taCzTxNBtjXDZ"
            >
              <Image
                className="mx-auto img-responsive"
                src="/BUDDY.png"
                alt="BUDDY NFT"
                width={680}
                height={400}
                layout="responsive"
              />
            </a>
          </div>
          <div className="w-full md:w-1/3 px-2 py-4 rounded align-middle">
            <h2 className="text-2xl lg:text-3xl underline mb-4 text-right font-serif text-purple-500">
              Special Promotion
            </h2>
            <p className="text-xl lg:text-2xl text-right">
              Rent access to exclusive BUDDY content. Enjoy a short film,
              metaverse 3D model, comic book and concept art.
            </p>
          </div>
        </div>
        <div className="w-full mx-auto mb-12 flex flex-wrap overflow-hidden grid-cols-3">
          <div className="w-full md:w-1/3 mb-8 px-2 rounded">
            <Image
              className="mx-auto img-responsive"
              src="/5min.jpg"
              alt="5 Minute Access"
              width={680}
              height={400}
              layout="responsive"
            />
            <div>
              <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mint5MinAccess}
              >
                Mint Access NFT 5
              </button>
              {/* <CrossmintPayButton
                clientId={CROSS_MINT_5MIN_CLIENT_ID}
                mintConfig={{ type: "candy-machine" }}
                environment="production"
              /> */}
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-8 px-2 rounded">
            <Image
              className="mx-auto img-responsive"
              src="/10min.jpg"
              alt="10 Minute Access"
              width={680}
              height={400}
              layout="responsive"
            />
            <div>
              <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mint10MinAccess}
              >
                Mint Access NFT 10
              </button>
              {/* <CrossmintPayButton
                clientId={CROSS_MINT_10MIN_CLIENT_ID}
                mintConfig={{ type: "candy-machine" }}
                environment="production"
              /> */}
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-8 px-2 rounded">
            <Image
              className="mx-auto img-responsive"
              src="/30min.jpg"
              alt="30 Minute Access"
              width={680}
              height={400}
              layout="responsive"
            />
            <div>
              <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mint30MinAccess}
              >
                Mint Access NFT 30
              </button>
              {/* <CrossmintPayButton
                clientId={CROSS_MINT_30MIN_CLIENT_ID}
                mintConfig={{ type: "candy-machine" }}
                environment="production"
              /> */}
            </div>
          </div>
        </div>
        {isMinting === true && <LoadSpinner />}
        {isConnected && mintedNft && (
          <div
            style={{
              padding: "1.5rem",
              fontSize: "1rem",
              width: "100%",
              display: "inline-block",
              textAlign: "left",
              wordWrap: "normal",
            }}
          >
            <div>
              <label
                className="bg-gray-900 text-gray-400 text-left"
                placeholder="Minted"
              >
                Minted-NFt : {JSON.stringify(mintedNft)}
              </label>
            </div>
          </div>
        )}{" "}
      </div>
    </>
  );
}
