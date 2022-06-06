import {MoonbeamEvent} from '@subql/contract-processors/dist/moonbeam';
import {Transaction} from "../types";

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

    const hexSignature = event.args.functionSignature;

    if(decodeFunctionSignature(hexSignature)){

        const transaction = new Transaction(event.transactionHash);
        const { amount, amountOutMin, user, token} = decodeFunctionSignature(hexSignature);
    
        transaction.amount = amount;
        transaction.amountOutMin = amountOutMin;
        transaction.user = user;
        transaction.token = token;
    
        await transaction.save();
    }


}
