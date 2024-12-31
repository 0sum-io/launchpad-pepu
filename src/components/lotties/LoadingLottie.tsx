import { Flex, UrlLottie, coerceCssPixelValue } from "@boxfoxs/bds-web";

interface Props {
  width: number;
}

export function LoadingLottie({ width }: Props) {
  return (
    <UrlLottie
      src="/lotties/loading.json"
      style={{
        width: coerceCssPixelValue(width),
        height: coerceCssPixelValue(width),
      }}
      options={{
        renderer: "svg",
        loop: true,
        autoplay: true,
      }}
    />
  );
}
