import { useCheckIsMobile } from "@boxfoxs/bds-web";

import { ConnectButton } from "components/Button";
import { useThirdWeb } from "components/provider/ThirdWebProvider";
import { useAddress } from "hooks/on-chain";
import { shortenAddress } from "utils/format";

export function WalletControl() {
  const isMobile = useCheckIsMobile();
  const open = useThirdWeb();
  const address = useAddress();

  const handleClick = () => {
    open();
  };

  return (
    <div style={{ position: "relative" }}>
      <ConnectButton
        className="WalletControl"
        theme="primary"
        onClick={handleClick}
        padding={"12px 24px"}
        textSize={16}
      >
        {address ? `${shortenAddress(address)}` : "Connect"}
      </ConnectButton>
    </div>
  );
}
