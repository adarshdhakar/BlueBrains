import { useMemo, useState } from "react";
import { Download, Info, ExternalLink, Clipboard } from "lucide-react";

function toPercent(x) {
  if (typeof x !== "number" || isNaN(x)) return 0;
  if (Math.abs(x) <= 1) return Math.max(0, Math.min(100, Math.round(x * 100)));
  return Math.max(0, Math.min(100, Math.round(x)));
}

function Progress({ value, label }) {
  const pct = toPercent(value);
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <span className="text-sm" style={{ color: "var(--subtext)" }}>
          {label}
        </span>
        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
          {pct}%
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

function EntityChip({ children }) {
  return (
    <span
      className="px-2 py-0.5 text-xs rounded-md border"
      style={{ borderColor: "var(--border)", color: "var(--text)" }}
    >
      {children}
    </span>
  );
}

export default function ResultSection({
  score = 0,
  result = null,
  setRawOpen = () => {},
}) {
  const safe = result ?? {};
  const isNotEmpty = Object.keys(safe).length > 0;

  const formattedTS = useMemo(() => {
    const ts = safe.raw?.ts ?? null;
    if (!ts) return null;
    try {
      const d = new Date(ts);
      return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Date(ts).toString();
    }
  }, [safe.raw?.ts]);

  const [showFormal, setShowFormal] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloadFormalReport = () => {
    const content = safe.formal_report || "No formal report available.";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyFormalReport = async () => {
    try {
      const text = safe.formal_report || "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* {isNotEmpty && ( */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6 justify-between">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                Results
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--subtext)" }}>
                Clear, educational insights designed for quick scanning.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRawOpen(true)}
                className="px-3 py-2 rounded-xl border text-sm inline-flex items-center gap-2 cursor-pointer"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                <Info size={16} /> Raw JSON
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 mt-6">
            <div
              className="rounded-3xl border p-5 md:p-6 flex flex-col items-start mb-4"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="w-full flex items-center justify-between">
                <div className="text-xl" style={{ color: "white" }}>
                  Credibility Score
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 w-full">
                <div className="relative grid place-items-center h-28 w-28">
                  <svg viewBox="0 0 36 36" className="h-28 w-28">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${toPercent(
                        safe.credibility_score ?? score
                      )},100`}
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div
                    className="absolute text-xl font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {toPercent(safe.credibility_score ?? score)}
                    <span className="text-xs">%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <Progress
                    value={safe.metrics?.clarity ?? 0}
                    label="Clarity"
                  />
                  <Progress value={safe.metrics?.tone ?? 0} label="Tone" />
                  <Progress
                    value={safe.metrics?.correctness ?? 0}
                    label="Correctness"
                  />
                  <Progress
                    value={safe.metrics?.originality ?? 0}
                    label="Originality"
                  />
                </div>
              </div>

              <div
                className="mt-5 text-xs space-y-1"
                style={{ color: "var(--subtext)" }}
              >
                {formattedTS ? (
                  <div>Analyzed: {formattedTS} (IST)</div>
                ) : (
                  <div>No timestamp</div>
                )}
                {safe.category && <div>Category: {safe.category}</div>}
                {safe.subcategory && <div>Subcategory: {safe.subcategory}</div>}
              </div>
            </div>

            <div className="flex flex-col gap-5 col-span-2 mb-4 h-full">
              <div
                className="rounded-3xl border p-5 md:p-6 w-full"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-xl font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      Report Summary
                    </div>
                  </div>
                  <a
                    href="#methodology"
                    className="text-sm inline-flex items-center gap-1"
                    style={{ color: "var(--accent)" }}
                  >
                    Methodology <ExternalLink size={14} />
                  </a>
                </div>

                <p
                  className="mt-2 leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  {safe.report_summary ??
                    "Run an analysis to see a concise summary here."}
                </p>
              </div>

              <div
                className="rounded-3xl border p-5 md:p-6 w-full flex-1 flex flex-col mb-4"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="text-xl font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Analysis
                </div>
                <div
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  {safe.analysis ?? "No detailed analysis available."}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div
              className="rounded-3xl border p-5 md:p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-sm mb-2" style={{ color: "var(--subtext)" }}>
                Detected Entities
              </div>
              <div className="space-y-2">
                {(safe.key_entities ?? []).length === 0 && (
                  <div className="text-sm" style={{ color: "var(--subtext)" }}>
                    No entities yet.
                  </div>
                )}
                {(safe.key_entities ?? []).map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--text)" }}>
                      {e}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{
                        background:
                          "color-mix(in oklab, var(--accent) 100%, transparent)",
                        color: "white",
                      }}
                    >
                      entity
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-3xl border p-5 md:p-6 md:col-span-2"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="text-sm mb-3"
                  style={{ color: "var(--subtext)" }}
                >
                  Sources & credibility
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {(safe.sources ?? []).length} source(s)
                </div>
              </div>

              <div className="space-y-3">
                {(safe.sources ?? []).length === 0 && (
                  <div className="text-sm" style={{ color: "var(--subtext)" }}>
                    No sources provided.
                  </div>
                )}
                {(safe.sources ?? []).map((s, i) => {
                  const pct = toPercent(s.credibility_score ?? 0);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-sm flex justify-between"
                          style={{ color: "var(--text)" }}
                        >
                          {s.name}
                          <div
                            className="w-14 text-right text-sm font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {pct}%
                          </div>
                        </a>
                        <div
                          className="text-xs mt-1 truncate"
                          style={{ color: "var(--subtext)" }}
                        >
                          {s.url}
                        </div>
                        <div
                          className="h-2 w-full rounded-full overflow-hidden mt-2"
                          style={{ background: "var(--border)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: "var(--midBlue)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
        {/* {safe.formal_report && ( */}
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text)" }}
          >
            Formal Reporting
          </h2>
          <div className="flex flex-col md:flex-row gap-5">
            {/* Formal Report Display */}
            <div
              className="rounded-3xl border p-5 md:p-6 w-full md:w-[60%]"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadFormalReport}
                  className="px-3 py-2 rounded-xl border text-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={copyFormalReport}
                  className="px-3 py-2 rounded-xl border text-sm inline-flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <Clipboard size={14} /> {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div
                className="mt-3 p-3 rounded-md border"
                style={{
                  borderColor: "var(--border)",
                  background: "rgba(0,0,0,0.02)",
                }}
              >
                <pre
                  className="text-xs whitespace-pre-wrap font-sans"
                  style={{ color: "var(--text)" }}
                >
                  {safe.formal_report ?? "No formal report available."}
                </pre>
              </div>
            </div>

            {/* Reporting Links Section */}
            <div
              className="rounded-3xl border p-5 md:p-6 w-full md:w-[40%]"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--text)" }}
              >
                Report to Authorities & Platforms
              </h3>
              <p className="text-xs mb-4" style={{ color: "#e5e5e5" }}>
                Use the generated report to file a complaint on these official
                portals.
              </p>
              <div className="space-y-3">
                {/* National Cyber Crime Portal */}
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {/* You can use an SVG or an icon library for the icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>National Cyber Crime Portal</span>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://help.x.com/en/safety-and-security/report-a-post"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                    <path d="m9.5 8.5 5 7" />
                    <path d="m14.5 8.5-5 7" />
                  </svg>
                  <span>Report on X (Twitter)</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/help/1380418588640631/?helpref=hc_fnav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span>Report on Facebook</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://help.instagram.com/192435014247952"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Report on Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
        <div id="methodology">
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text)" }}
          >
            Our Methodologies
          </h2>
          <div
            className="rounded-3xl border p-5 md:p-6"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text)" }}
              >
                How we score
              </h3>
              <a
                href="https://example.com/methodology"
                target="_blank"
                rel="noreferrer"
                className="text-sm inline-flex items-center gap-1"
                style={{ color: "var(--accent)" }}
              >
                Read more <ExternalLink size={14} />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {[
                {
                  title: "Clarity",
                  body: "Measures readability, structure, and concise phrasing.",
                },
                {
                  title: "Tone",
                  body: "Checks for audience fit, consistency, and sentiment.",
                },
                {
                  title: "Correctness",
                  body: "Flags grammar, spelling, and factual mismatches.",
                },
                {
                  title: "Originality",
                  body: "Assesses uniqueness and avoidance of plagiarism.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl border p-4 h-full"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="font-medium" style={{ color: "var(--text)" }}>
                    {card.title}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: "var(--subtext)" }}
                  >
                    {card.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
