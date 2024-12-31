import { NotFound } from "components/NotFound";
import { useRouter } from "next/router";

export default function NotFoundPage() {
  const router = useRouter();

  return <NotFound />;
}
