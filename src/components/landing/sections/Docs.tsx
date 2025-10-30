import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { cn } from "@/lib/utils";
const DASHBOARD_URL = "/dashboard";
const SDK_URL = "/sdk";

const WhyIDRABadge = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "bg-[#870E1680] px-4 py-1 italic rounded-full text-sm md:text-lg font-instrument-serif tracking-wide text-white font-medium w-fit ",
        className
      )}
    >
      <p>AUDIT</p>
    </div>
  );
};

export const Docs = () => {
  return (
    <section
      className="relative mx-auto flex max-w-[1100px] px-4 w-full min-h-screen"
      id="transparency"
    >
      <div className="p-[1px] rounded-3xl overflow-hidden bg-gradient-to-r from-white via-black to-white mx-auto w-full h-fit">
        <div className="w-full rounded-3xl py-8 px-8 flex flex-col-reverse md:flex-row justify-between items-center bg-[#050404] relative">
          <img
            src="/images/img-as-light-red.png"
            className="absolute top-0 -right-1/6 h-[300px] object-cover md:w-auto md:-right-1/6 md:h-[450px]"
          />
          <div className="md:row-start-2">
            <WhyIDRABadge className="hidden md:block" />
            <h1 className="mt-6 text-3xl md:text-4xl font-bold font-figtree">
              TRANSPARENCY & <br />
              AUDIT DOCS
            </h1>
            <p className="text-base md:text-lg mt-4 font-geist-mono">
              Trust must be proven. $IDRA is independently audited to <br />{" "}
              guarantee 1:1 backup and top-tier security. See our full <br />{" "}
              report to verify our data and compliance.
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center mt-6 gap-4">
              <PrimaryButton
                onClick={() => window.open(DASHBOARD_URL, "_blank")}
              >
                Audit Report
              </PrimaryButton>
              <SecondaryButton
                onClick={() => window.open(SDK_URL, "_blank")}
                className="bg-[#2D2D2D]"
              >
                Transparency Report
              </SecondaryButton>
            </div>
          </div>
          <Image
            src="/images/docs.png"
            width={200}
            height={200}
            alt="docs"
            className="w-32 md:w-80 h-fit self-start md:self-auto"
          />
          <WhyIDRABadge className="md:col-start-1 md:row-start-1 md:hidden self-start md:self-auto mb-4" />
        </div>
      </div>
    </section>
  );
};
