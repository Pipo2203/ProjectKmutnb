"use client";

import { useState } from "react";

export function CodeViewer({
  code,
  filename = "snippet.txt",
}: {
  code: string;
  filename?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = code.trim().split("\n");

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 border border-slate-700 bg-slate-900 rounded-xl overflow-hidden shadow-md font-mono text-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors border-b border-slate-700/50"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">📄 {filename}</span>
          <span className="text-[10px] text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded-full">
            {lines.length} บรรทัด
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isOpen && (
            <button
              onClick={handleCopy}
              className="text-[11px] bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded transition-colors"
            >
              {copied ? "✓ คัดลอกแล้ว" : "📋 คัดลอก"}
            </button>
          )}
          <span className="text-slate-400 font-bold">
            {isOpen ? "▲ ซ่อนโค้ด" : "▼ แสดงโค้ด"}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 overflow-x-auto bg-[#1e1e1e] text-slate-200 flex leading-relaxed">
          <div className="select-none text-right pr-4 text-slate-600 border-r border-slate-800 font-mono">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="pl-4 font-mono whitespace-pre text-slate-100 flex-1">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
