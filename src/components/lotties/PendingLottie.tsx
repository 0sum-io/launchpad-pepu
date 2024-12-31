import { UrlLottie } from "@boxfoxs/bds-web";

interface Props {
  width: number;
}

export function PendingLottie({ width }: Props) {
  return (
    <UrlLottie
      src="/lotties/pending.json"
      style={{ width: width + "px", height: width + "px", display: "flex" }}
      options={{
        renderer: "svg",
        loop: true,
        autoplay: true,
      }}
    />
  );
}
