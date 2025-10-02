import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";

export default function PrivyLoginButton() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  const disableLogin = !ready || (ready && authenticated);

  return (
    <Button onClick={login} disabled={disableLogin}>
      Login
    </Button>
  );
}
