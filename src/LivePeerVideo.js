import React, {
  useEffect,
  useState,
} from "react";
import { VideoPlayer } from "@livepeer/react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import abi from "./abi/SuperliveAbi.json";
import ISuperTokenAbi from "./abi/ISuperTokenAbi.json";
import IERC20Abi from "./abi/IERC20Abi.json";
import { Web3Provider } from "@ethersproject/providers";
import { Framework } from "@superfluid-finance/sdk-core";

function LivePeerVideo() {
  const { id } = useParams();
  const [
    joineeAddress,
    setJoineeAddress,
  ] = useState("");

  const provider =
    new ethers.providers.Web3Provider(
      window.ethereum
    );

  const SuperLiveContract =
    new ethers.Contract(
      process.env.REACT_APP_F5LABS_LIVE_PEER_SMART_CONTRACT_ADDRESS,
      abi,
      provider
    );

  /*const getData = async () => {
    SuperLiveContract.getStreamData(
      id
    ).then((data) => {
      setToken(data?.token)
    });
  };*/

  const JoinButton = async () => {
    await provider
      .getSigner()
      .getAddress()
      .then((address) => {
        join(
          id,
          SuperLiveContract,
          provider,
          address
        );
      });
  };

  async function join(
    streamId,
    contract,
    provider,
    joineeAddress
  ) {
    // provider: joinees metamask provider.
    // contract: The SuperLive contract instance

    // get the ISuperTokenAbi from etherscan
    // provider is metamask provider of joinee
    let streamData =
      await contract.getStreamData(
        streamId
      );
    let paymentTokenAddress =
      streamData.token;

    // todo verify: provider.address should be address of the joinee

    /*let joineeSigner =
      provider.getSigner();*/

    /*await joineeSigner
      .getAddress()
      .then((address) => {
        setJoineeAddress(address);
      });*/
    // todo verify if this works also;

    let streamPaymentToken =
      await new ethers.Contract(
        paymentTokenAddress,
        ISuperTokenAbi,
        provider
      );

    let streamPaymentTokenBalance =
      streamPaymentToken
        .balanceOf(joineeAddress)
        .then((balance) => {
          console.log(
            balance.toString()
          );
        }); // there should be a way to get this joinee address from the metamask proivder of joinee

    const sf = await Framework.create({
      chainId:
        provider._network.chainId, // todo: need to check if this works with metamask provider
      provider: provider,
    });

    const metamaskProvider =
      new Web3Provider(window.ethereum);
    const joineeSigner =
      sf.createSigner({
        web3Provider: metamaskProvider,
      });

    if (
      streamPaymentTokenBalance == 0
    ) {
      let underlyingTokenAddress =
        await streamPaymentToken.getUnderlyingToken();
      // get the IERC20Abi from etherscan
      let underlyingToken =
        await new ethers.Contract(
          underlyingTokenAddress,
          IERC20Abi,
          provider
        );
      let underlyingTokenBalance =
        await underlyingToken.balanceOf(
          joineeAddress
        );
      underlyingTokenBalance.then(
        (balance) => {
          console.log(balance);
        }
      );
      if (underlyingTokenBalance == 0) {
        // todo: we need to show user on the UI warning that he needs either underlying token or payment token
        console.log(
          `Please top up ${underlyingTokenName} or ${streamPaymentTokenName}`
        );
        // stream payment is not possible without the above
        return false;
      } else {
        // time to convert some tokens
        // first need to check if the address has already given the one time approval

        let allowance =
          await underlyingToken.allowance(
            joineeAddress,
            streamPaymentToken.address
          );
        if (allowance == 0) {
          // Giving superToken the permission to spend
          let approvalTxn =
            await underlyingToken.approve(
              streamPaymentToken.address,
              underlyingTokenBalance
            );
          await approvalTxn.wait();
        }
        let upgradeTxn =
          await streamPaymentToken.upgrade(
            underlyingTokenBalance
          );
        let upgradeTxnReceipt =
          await upgradeTxn.wait();
      }
    }

    //  now that we're pretty sure SuperToken balance exists, we can prepeare join
    // next we use superfluid sdk-core to allow operator permission to our smart contract to
    // allow flow. Ofc we first have to check if it already exists, if it  does then we do nothing.

    const operatorPermissionsExist =
      await streamPaymentToken.isOperatorFor(
        contract.address,
        joineeAddress
      );

    if (
      operatorPermissionsExist == false
    ) {
      // if permission doesn't exist we have to get it
      let updateFlowOperatorOperation =
        await sf.cfaV1.updateFlowOperatorPermissions(
          {
            flowOperator:
              contract.address,
            permissions: 5, // create or delete
            flowRateAllowance:
              streamData.rate, // 1k per month, todo: https://docs.superfluid.finance/superfluid/developers/solidity-examples/cfa-access-control-list-acl#flow-rate-allowance
            superToken:
              streamData.token,
          }
        );

      let txn =
        await updateFlowOperatorOperation.exec(
          joineeSigner
        );
      let txnReceipt = await txn.wait();
    }

    // Now after all this we can call join function, which'd create flow on operators behalf
    let joinTxn = await contract
      .connect(joineeAddress)
      .join(streamId);
    let joinTxnReceipt =
      await joinTxn.wait();

    // Lastly we check if join was successful
    let hasJoined =
      await contract.hasJoined(
        streamId,
        joineeAddress
      );
    console.log(hasJoined);
    return hasJoined;
  }

  return (
    <>
      <VideoPlayer
        autoPlay
        loop
        muted
        playbackId={id}
        width="600px"
        height="550px"
      />
      <button
        className="bg-blue-500 text-white"
        onClick={JoinButton}
      >
        Join
      </button>
    </>
  );
}

export default LivePeerVideo;
