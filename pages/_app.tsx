import { PopupProvider, PortalProvider } from "@boxfoxs/bds-web";
import { SEOHeader } from "@boxfoxs/next-seo";
import styled from "@emotion/styled";
import { RootProvider, RootStateProvider } from "components/provider";
import { SnackBarProvider } from "components/snackbar/SnackBarProvider";
import { ColorModeProvider } from "hooks/common";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import "../styles/globals.scss";
import Head from "next/head";
import LatestPurchasesTicker from "containers/launchpad/pages/list/components/LatestPurchases";
import NewListingsTicker from "containers/launchpad/pages/list/components/NewListings";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ColorModeProvider>
      <SEOHeader
        title={process.env.NEXT_PUBLIC_NAME}
        description="Token Launchpad"
        url={""}
        thumbnail={process.env.NEXT_PUBLIC_LOGO}
      />
      <Head>
        <title>Launchpad</title>
        <link
          rel="icon"
          type="image/x-icon"
          href={process.env.NEXT_PUBLIC_LOGO}
        />
      </Head>
      <RootProvider>
          <RecoilRoot>
            <QueryClientProvider client={client}>
              <LatestPurchasesTicker />
                <RootStateProvider>
                  <PortalProvider>
                    <SnackBarProvider>
                      <PopupProvider>
                        <RootContainer>
                          <Component {...pageProps} />
                        </RootContainer>
                      </PopupProvider>
                    </SnackBarProvider>
                  </PortalProvider>
                </RootStateProvider>
              <NewListingsTicker />
            </QueryClientProvider>
          </RecoilRoot>
      </RootProvider>
    </ColorModeProvider>
  );
}

const RootContainer = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  *::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  min-height: 100vh;
  transition: background 300ms;

  // background-image: url("https://pepeunchained.com/assets/images/banner.png");
  background-color: #0f0f0f;
  background-size: cover;
  background-position: center;
`;

export default MyApp;
