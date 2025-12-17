import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET }); // Adapting to the constant if I mapped it, but simplier to just use Enum
export const aptos = new Aptos(config);
