"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import type { DepositFormValues } from "../../deposit-modal";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import mBankingGuide from "./mBankingGuide.json";
import iBankingGuide from "./iBankingGuide.json";
import atmGuide from "./atmGuide.json";
import qrisGuide from "./qris.json";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <div className="font-mono text-sm break-all">{value}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

export function PaymentSummaryStep() {
  const form = useFormContext<DepositFormValues>();
  const { goNext, goPrevious } = useMultiStepModal();
  const method = form.watch("paymentMethod");
  const amount = form.watch("amount") ?? 0;
  const va = form.watch("vaNumber") ?? undefined;
  const qrisPayload = form.watch("qrisPayload") ?? undefined;
  const [showGuideMBanking, setShowGuideMBanking] = React.useState(true);
  const [showGuideIBanking, setShowGuideIBanking] = React.useState(false);
  const [showGuideATM, setShowGuideATM] = React.useState(false);
  const [showQrisGuide, setShowQrisGuide] = React.useState(true);
  const [showQrisNotConfirmed, setShowQrisNotConfirmed] = React.useState(false);

  const withTokens = (text: string) =>
    text.replaceAll("xxxAccountNumberxxx", va ?? "");

  const onContinue = () => {
    goNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-lg">
        {/* Amount rows */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4B5563] text-base">Total Price</span>
          <span className="font-semibold">
            Rp {amount?.toLocaleString?.("id-ID") ?? amount}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4B5563] text-base">Receive Assets</span>
          <span className="font-semibold">
            {amount?.toLocaleString?.("id-ID") ?? amount} IDRA
          </span>
        </div>

        {/* VA or QR */}
        {method === "va" && va && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[#4B5563] text-base">Virtual Account</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">BCA {va}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigator.clipboard.writeText(va)}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Estimated time */}
        <Separator className="my-2" />
        <div className="flex items-center justify-between text-sm mb-8">
          <span className="text-[#4B5563] text-base">Estimated Time</span>
          <span className="font-medium">~30s</span>
        </div>
        {method === "qris" && qrisPayload && (
          <QrisBlock payload={qrisPayload} />
        )}

        {/* Guide accordions */}
        {method === "va" && (
          <div className="mt-4 space-y-4">
            {/* mBanking */}
            <div>
              <button
                type="button"
                onClick={() => setShowGuideMBanking((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-medium"
              >
                Petunjuk Transfer mBanking
                {showGuideMBanking ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>
              {showGuideMBanking && (
                <ol className="mt-3 space-y-3 text-sm">
                  {mBankingGuide.map((t, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <span className="bg-[#E5E7EB] font-bold text-[#4B5563] flex-shrink-0 size-6 inline-flex items-center justify-center rounded-full text-[14px]">
                        {i + 1}
                      </span>
                      <span
                        className="font-figtree text-[#6B7280]"
                        dangerouslySetInnerHTML={{ __html: withTokens(t) }}
                      />
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowGuideIBanking((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-medium"
              >
                Petunjuk Transfer iBanking
                {showGuideIBanking ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>
              {showGuideIBanking && (
                <ol className="mt-3 space-y-3 text-sm">
                  {iBankingGuide.map((t, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <span className="bg-[#E5E7EB] font-bold text-[#4B5563] flex-shrink-0 size-6 inline-flex items-center justify-center rounded-full text-[14px]">
                        {i + 1}
                      </span>
                      <span
                        className="font-figtree text-[#6B7280]"
                        dangerouslySetInnerHTML={{ __html: withTokens(t) }}
                      />
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowGuideATM((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-medium"
              >
                Petunjuk Transfer ATM
                {showGuideATM ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>
              {showGuideATM && (
                <ol className="mt-3 space-y-3 text-sm">
                  {atmGuide.map((t, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <span className="bg-[#E5E7EB] font-bold text-[#4B5563] flex-shrink-0 size-6 inline-flex items-center justify-center rounded-full text-[14px]">
                        {i + 1}
                      </span>
                      <span
                        className="font-figtree text-[#6B7280]"
                        dangerouslySetInnerHTML={{ __html: withTokens(t) }}
                      />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}

        {method === "qris" && (
          <div className="mt-4 space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setShowQrisGuide((v) => !v)}
                className="flex w-full items-center justify-between text-sm font-medium"
              >
                {qrisGuide.guideTitle}
                {showQrisGuide ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>
              {showQrisGuide && (
                <ol className="mt-3 space-y-3 text-sm">
                  {qrisGuide.guideSteps.map((t: string, i: number) => (
                    <li key={i} className="flex gap-3 items-center">
                      <span className="bg-[#E5E7EB] font-bold text-[#4B5563] flex-shrink-0 size-6 inline-flex items-center justify-center rounded-full text-[14px]">
                        {i + 1}
                      </span>
                      <span
                        className="font-figtree text-[#6B7280]"
                        dangerouslySetInnerHTML={{ __html: withTokens(t) }}
                      />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goPrevious}>
          Back
        </Button>
        <Button onClick={onContinue}>I have paid / Continue</Button>
      </div>
    </div>
  );
}

function QrisBlock({ payload }: { payload: string }) {
  const [remaining, setRemaining] = React.useState(300); // 5 minutes in seconds

  React.useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, 300 - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(
    payload
  )}`;

  const download = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = "qris.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-[#F1F5F9] rounded-lg p-4 flex flex-col items-center gap-4">
      <div className="text-3xl font-extrabold tracking-wider">
        {minutes}:{seconds}
      </div>
      <div className="flex items-center justify-center">
        <img
          alt="QRIS QR"
          className="border rounded-md p-2 bg-white"
          src={src}
          width={280}
          height={280}
        />
      </div>
      <Button className="mt-2" onClick={download}>
        Download QR
      </Button>
    </div>
  );
}
