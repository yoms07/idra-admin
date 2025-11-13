import fs from "fs";
import ReactMarkdown from "react-markdown";

export const dynamic = "force-static";

async function getMarkdownContent() {
  const fileContent = fs.readFileSync(
    "src/app/(landing)/whitepaper/whitepaper.md",
    "utf-8"
  );
  return fileContent;
}

export default async function TermsPage() {
  const markdownContent = await getMarkdownContent();

  return (
    <div className="bg-landing-background">
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="prose prose-gray max-w-none font-figtree">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
