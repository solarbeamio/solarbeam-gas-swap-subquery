import {MoonbeamEvent} from '@subql/contract-processors/dist/moonbeam';
import {BigNumber, utils} from "ethers";
import {Transaction} from "../types";

// Setup types from ABI
// type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
// type ApproveCallArgs = [string, BigNumber] & { _spender: string; _value: BigNumber; }
type EventArgs = [string, string, any] & { userAddress: string; relayerAddress: string, functionSignature: any };


export async function handleMetaTransactionEvent(event: MoonbeamEvent<EventArgs>): Promise<void> {
    let transaction = new Transaction(event.transactionHash);
    transaction.userAddress = event.args.userAddress;
    transaction.tokenAddress = event.args.relayerAddress;
    let hexSignature = event.args.functionSignature;
    logger.info(`transaction: ${{...transaction}}`);
    logger.info('=================================================================================');
    logger.info(`transaction.userAddress: ${transaction.userAddress.toString()}`);
    logger.info('=================================================================================');
    logger.info(`hexSignature: ${hexSignature.toString()}`);
    logger.info('=================================================================================');
    let takis = utils.defaultAbiCoder.decode(['uint256'], hexSignature);
    logger.info(`takis: ${takis}`)
    await transaction.save();
}


// export async function handleFrontierEvmEvent(event: FrontierEvmEvent<TransferEventArgs>): Promise<void> {
//     const transaction = new Transaction(event.transactionHash);

//     transaction.value = event.args.value.toBigInt();
//     transaction.from = event.args.from;
//     transaction.to = event.args.to;
//     transaction.contractAddress = event.address;

//     await transaction.save();
// }

// export async function handleFrontierEvmCall(event: FrontierEvmCall<ApproveCallArgs>): Promise<void> {
//     const approval = new Approval(event.hash);

//     approval.owner = event.from;
//     approval.value = event.args._value.toBigInt();
//     approval.spender = event.args._spender;
//     approval.contractAddress = event.to;

//     await approval.save();
// }
