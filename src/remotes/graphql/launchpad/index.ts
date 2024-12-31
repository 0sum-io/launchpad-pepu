import { EVMChainId } from "models/ChainId";

export * as evmLaunchpad from "./chain";

import * as evmLaunchpad from "./chain";

export const LaunchpadQueries = {
  [EVMChainId.CHAIN]: evmLaunchpad,
};
