import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
const DASHBOARD_URL = "/dashboard";
const SDK_URL = "/sdk";

export const Docs = () => {
  return (
    <section className="relative mx-auto flex max-w-[1100px] px-4 w-full min-h-screen">
      <div className="p-0.5  rounded-xl overflow-hidden bg-gradient-to-r from-white via-black to-white mx-auto w-full h-fit">
        <div className="w-full rounded-xl py-8 px-8 flex justify-between gap-24 items-center bg-[#050404]">
          <div>
            <p className="italic px-4 py-2 bg-primary-1000/80 w-fit rounded-full">
              Account Abstraction
            </p>
            <h1 className="mt-6 text-5xl font-bold">
              TRANSPARENCY & <br />
              AUDIT DOCS
            </h1>
            <p className="text-xl mt-4">
              Trust must be proven. $IDRA is independently audited to <br />{" "}
              guarantee 1:1 backup and top-tier security. See our full <br />{" "}
              report to verify our data and compliance.
            </p>
            <div className="flex items-center mt-6 gap-2">
              <PrimaryButton
                onClick={() => window.open(DASHBOARD_URL, "_blank")}
              >
                Login / signup
              </PrimaryButton>
              <SecondaryButton onClick={() => window.open(SDK_URL, "_blank")}>
                Explore SDKs
              </SecondaryButton>
            </div>
          </div>
          <Image
            src="/images/docs.png"
            width={200}
            height={200}
            alt="docs"
            className="w-80 h-fit"
          />
        </div>
      </div>
    </section>
  );
};
