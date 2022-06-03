import {MoonbeamEvent} from '@subql/contract-processors/dist/moonbeam';
import {BigNumber, utils} from "ethers";
import {Transaction} from "../types";

// Setup types from ABI
// type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
// type ApproveCallArgs = [string, BigNumber] & { _spender: string; _value: BigNumber; }
type EventArgs = [string, string, any] & { userAddress: string; relayerAddress: string, functionSignature: string };

function decodeFunctionSignature(functionData: string){
    const PREFIX = 2
    const FUNCTION = 8
    const WORD = 64
    const ADDRESS_OFFSET = 24
    const SWAP_OP = '627dd56a'

    const functionOpcode = functionData.substring(PREFIX, PREFIX + FUNCTION)

    if (functionOpcode.localeCompare(SWAP_OP) == 0) {

        const data = functionData.substring(PREFIX + FUNCTION)
        const amount = BigInt('0x' + data.substring(2 * WORD, 3 * WORD))
        const amountOutMin = BigInt('0x' + data.substring(3 * WORD, 4 * WORD))
        const user = '0x' + data.substring(5 * WORD + ADDRESS_OFFSET, 6 * WORD)
        const token = '0x' + data.substring(11 * WORD + ADDRESS_OFFSET, 12 * WORD)

        return {
            amount,
            amountOutMin,
            user,
            token
        }
    }

    return null
}

export async function handleMetaTransactionEvent(event: MoonbeamEvent<EventArgs>): Promise<void> {
    let transaction = new Transaction(event.transactionHash);
    transaction.userAddress = event.args.userAddress;
    transaction.tokenAddress = event.args.relayerAddress;
    let hexSignature = event.args.functionSignature;
    logger.info(`transaction: ${{...transaction}}`);
    logger.info('=================================================================================');
    logger.info(`transaction.userAddress: ${transaction.userAddress}`);
    logger.info('=================================================================================');
    logger.info(`hexSignature: ${hexSignature.toString()}`);
    logger.info('=================================================================================');
    // let takis = utils.defaultAbiCoder.decode(['uint256'], hexSignature);
    // logger.info(`takis: ${takis}`)
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
