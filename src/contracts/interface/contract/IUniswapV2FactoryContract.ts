import GenericContract from "../common/GenericContract";

export interface IUniswapV2FactoryContract extends GenericContract {
  createPair: (tokenA: string, tokenB: string) => Promise<any>;
}
