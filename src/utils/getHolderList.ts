import { ethers } from "ethers";
import ERC20ABI from "abis/evm/token/IERC20.json";

export async function getHolderList(
  token: string
): Promise<{ account: string; balance: string }[]> {
  const query = `query GetBalances {
    accountBalances(where: {token: "${token}"}) {
        account {
          id
        }
    }
  }`;
  const poolRes = await fetch(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const v3Res = await fetch(process.env.NEXT_PUBLIC_V3_GRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const v3Owners = (await v3Res.json()).data.accountBalances.map(
    (v) => v.account.id
  );
  const poolOwners = (await poolRes.json()).data.accountBalances.map(
    (v) => v.account.id
  );
  const owners = [...new Set([...v3Owners, ...poolOwners])]; // combine and remove duplicates
  const topHolders = [];
  for (let i = 0; i < owners.length; i++) {
    const holderBalance = await getBalanceOf(token, owners[i]);
    topHolders.push({
      account: owners[i],
      balance: holderBalance,
    });
  }
  return topHolders;
}

async function getBalanceOf(token, owner): Promise<ethers.BigNumber> {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );
  const erc20 = new ethers.Contract(token, ERC20ABI, provider);
  const balanceOf = await erc20.balanceOf(owner);
  console.log(balanceOf);
  return balanceOf;
}
