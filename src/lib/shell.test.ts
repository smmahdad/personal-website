import { describe, expect, it } from "vitest";
import { shellRoot } from "@/content/lab";
import {
  completeShell,
  displayPwd,
  getNode,
  listTree,
  resolvePath,
  runShellCommand,
} from "./shell";

describe("shell paths", () => {
  it("resolves home, relative, and parent paths", () => {
    expect(resolvePath("", "~")).toBe("");
    expect(resolvePath("", "about")).toBe("about");
    expect(resolvePath("about", "school")).toBe("about/school");
    expect(resolvePath("about/school", "..")).toBe("about");
    expect(resolvePath("work", "~/now")).toBe("now");
    expect(displayPwd("")).toBe("~");
    expect(displayPwd("work")).toBe("~/work");
  });

  it("finds public files and hides dotfiles from a plain listing", () => {
    expect(getNode(shellRoot, "now")?.kind).toBe("file");
    expect(getNode(shellRoot, "work/rippling")?.kind).toBe("file");
    expect(listTree(shellRoot).some((entry) => entry.name === ".secrets")).toBe(
      false,
    );
    expect(
      listTree(shellRoot, "", { hidden: true }).some(
        (entry) => entry.name === ".secrets",
      ),
    ).toBe(true);
  });
});

describe("runShellCommand", () => {
  it("answers the ordinary commands", () => {
    expect(runShellCommand("whoami", { cwd: "" }).lines).toEqual(["sam"]);
    expect(runShellCommand("pwd", { cwd: "work" }).lines).toEqual(["~/work"]);
    expect(runShellCommand("ls", { cwd: "" }).lines.join(" ")).toMatch(/about\//);
    expect(runShellCommand("ls", { cwd: "" }).lines.join(" ")).not.toMatch(
      /secrets/,
    );
    expect(runShellCommand("ls -a", { cwd: "" }).lines.join(" ")).toMatch(
      /\.secrets/,
    );
    expect(runShellCommand("cat now", { cwd: "" }).lines[0]).toMatch(/cursor/);
    expect(runShellCommand("cat work/rippling", { cwd: "" }).lines[0]).toMatch(
      /600ms/,
    );
    expect(runShellCommand("cd work", { cwd: "" }).cwd).toBe("work");
    expect(runShellCommand("now", { cwd: "" }).lines[0]).toMatch(/new york/);
  });

  it("keeps the easter eggs", () => {
    expect(runShellCommand("sudo make me a sandwich", { cwd: "" }).lines).toEqual([
      "okay.",
    ]);
    expect(runShellCommand("make me a sandwich", { cwd: "" }).lines[0]).toMatch(
      /yourself/,
    );
    expect(runShellCommand("sudo rm -rf /", { cwd: "" }).lines[0]).toMatch(
      /sentimental/,
    );
    expect(runShellCommand("xyzzy", { cwd: "" }).lines[0]).toMatch(/hollow/);
    expect(runShellCommand("vim", { cwd: "" }).action).toBe("vim");
    expect(runShellCommand("clear", { cwd: "" }).action).toBe("clear");
    expect(runShellCommand("exit", { cwd: "" }).action).toBe("exit");
  });

  it("picks a fortune from the list", () => {
    expect(
      runShellCommand("fortune", { cwd: "", rng: () => 0 }).lines[0],
    ).toMatch(/four seconds/);
  });

  it("plays the worlds as commands", () => {
    const auth = runShellCommand("authorize now", { cwd: "", rng: () => 0 });
    expect(auth.lines.join(" ")).toMatch(/600ms/);
    expect(auth.lines.join(" ")).toMatch(/approved|declined/);
    expect(runShellCommand("frisbee", { cwd: "", rng: () => 0 }).lines[0]).toMatch(
      /backhand/,
    );
    expect(runShellCommand("forecast", { cwd: "" }).lines.join(" ")).toMatch(
      /unrecognized/,
    );
    expect(runShellCommand("sign dad", { cwd: "" }).lines[0]).toBe("D · A · D");
    expect(runShellCommand("agent approve", { cwd: "" }).lines.join(" ")).toMatch(
      /card lives/,
    );
    expect(runShellCommand("help", { cwd: "" }).lines.join(" ")).toMatch(/frisbee/);
  });

  it("completes commands and files", () => {
    expect(completeShell("wh", "")).toBe("whoami");
    expect(completeShell("cat no", "")).toBe("cat now");
    expect(completeShell("cd ab", "")).toBe("cd about/");
    expect(completeShell("au", "")).toBe("authorize");
  });
});
