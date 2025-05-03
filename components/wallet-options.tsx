import * as React from "react";
import { useConnect } from "wagmi";
import { Button } from "./ui/button";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors
    .filter((connector) => connector.id === "cloud.universalprofile")
    .map((connector) => (
      <Button
        key={connector.uid}
        onClick={() => connect({ connector })}
        className="flex w-full gap-1 items-center bg-blue-600 hover:bg-blue-700 mb-5"
      >
        <img src={connector.icon} alt={connector.name} className="w-4 h-4" />
        Connect {connector.name}
      </Button>
    ));
}
