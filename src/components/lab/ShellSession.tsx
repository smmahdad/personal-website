"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { shellMotd, shellRoot } from "@/content/lab";
import {
  completeShell,
  displayPwd,
  listTree,
  runShellCommand,
} from "@/lib/shell";
import { LabMark } from "./LabMark";
import "./shell.css";

type Line = {
  kind: "in" | "out" | "motd";
  text: string;
};

const CHIPS = ["help", "ls", "now", "whoami", "tree", "fortune", "clear"];

export function ShellSession() {
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [cwd, setCwd] = useState("");
  const [value, setValue] = useState("");
  const [vim, setVim] = useState(false);
  const [vimBuf, setVimBuf] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [lines, setLines] = useState<Line[]>(
    shellMotd.map((text) => ({ kind: "motd" as const, text })),
  );

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines, vim]);

  const run = (raw: string) => {
    const input = raw.trim();
    if (!input) return;
    const result = runShellCommand(input, { cwd });
    setHistory((rows) => [...rows, input]);
    setHistIdx(-1);
    setValue("");

    if (result.action === "clear") {
      setLines([]);
      if (result.cwd !== undefined) setCwd(result.cwd);
      return;
    }
    if (result.action === "vim") {
      setVim(true);
      setVimBuf("");
      return;
    }
    if (result.cwd !== undefined) setCwd(result.cwd);
    setLines((rows) => [
      ...rows,
      { kind: "in", text: `${displayPwd(cwd)} $ ${input}` },
      ...result.lines.map((text) => ({ kind: "out" as const, text })),
    ]);
    if (result.action === "exit") {
      window.setTimeout(() => router.push("/lab/"), 280);
    }
  };

  const files = listTree(shellRoot, "", { hidden: true });

  if (vim) {
    return (
      <div className="shell-session">
        <header className="shell-top">
          <LabMark tone="shell" />
          <span className="shell-pwd">vim</span>
        </header>
        <div className="shell-vim">
          <pre>
            {`~\n~\n~  you're in vim.\n~  type :q\n~`}
          </pre>
          <form
            className="shell-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (vimBuf === ":q" || vimBuf === ":q!" || vimBuf === ":wq") {
                setVim(false);
                setVimBuf("");
                setLines((rows) => [
                  ...rows,
                  { kind: "out", text: "you escaped." },
                ]);
              } else {
                setVimBuf("");
              }
            }}
          >
            <label htmlFor="vim-cmd">:</label>
            <input
              id="vim-cmd"
              value={vimBuf.replace(/^:/, "")}
              onChange={(event) => setVimBuf(`:${event.target.value}`)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
            />
          </form>
          <p className="shell-vim-bar">VIM — :q to leave</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell-session">
      <header className="shell-top">
        <LabMark tone="shell" />
        <span className="shell-pwd">sam@ny:{displayPwd(cwd)}</span>
      </header>

      <div className="shell-body">
        <div
          className="shell-term"
          ref={scroller}
          onClick={() => field.current?.focus()}
        >
          {lines.map((line, index) => (
            <p key={`${line.kind}-${index}-${line.text}`} className="shell-line" data-kind={line.kind}>
              {/^https?:\/\//.test(line.text) ? (
                <a href={line.text} rel="noreferrer">
                  {line.text}
                </a>
              ) : (
                line.text
              )}
            </p>
          ))}
          <form
            className="shell-form"
            onSubmit={(event) => {
              event.preventDefault();
              run(value);
            }}
          >
            <label htmlFor="shell-cmd">{displayPwd(cwd)} $</label>
            <input
              id="shell-cmd"
              ref={field}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Tab") {
                  event.preventDefault();
                  setValue(completeShell(value, cwd));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  if (!history.length) return;
                  const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
                  setHistIdx(next);
                  setValue(history[next] ?? "");
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  if (histIdx < 0) return;
                  const next = histIdx + 1;
                  if (next >= history.length) {
                    setHistIdx(-1);
                    setValue("");
                  } else {
                    setHistIdx(next);
                    setValue(history[next] ?? "");
                  }
                }
              }}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Command"
            />
          </form>
        </div>

        <aside className="shell-files">
          <h2>files</h2>
          <div className="shell-tree">
            {files.map((entry) => (
              <button
                key={entry.path}
                type="button"
                data-kind={entry.kind}
                style={{ paddingLeft: `${entry.depth * 0.85}rem` }}
                onClick={() => {
                  if (entry.kind === "dir") run(`cd ~/${entry.path}`);
                  else run(`cat ~/${entry.path}`);
                }}
              >
                {entry.kind === "dir" ? `${entry.name}/` : entry.name}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className="shell-chips">
        {CHIPS.map((chip) => (
          <button key={chip} type="button" onClick={() => run(chip)}>
            {chip}
          </button>
        ))}
        <Link href="/lab/">exit</Link>
      </div>
    </div>
  );
}
