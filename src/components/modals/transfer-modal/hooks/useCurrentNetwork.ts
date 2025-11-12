"use client";

import { useFormContext } from "react-hook-form";
import { TransferFormValues } from "../transfer-modal";
import { useSupportedChains } from "@/features/transfer";

export const useCurrentNetwork = () => {
  const form = useFormContext<TransferFormValues>();
  const { data } = useSupportedChains();
  const { chainId } = form.getValues();

  return data?.find((d) => d.id === chainId);
};
