// Tiny line-level diff using LCS. Sufficient for showing what a Visual
// Edit changed across files — no external dependency needed.
export type DiffOp = "add" | "del" | "ctx";
export interface DiffLine {
  op: DiffOp;
  text: string;
  oldNo?: number;
  newNo?: number;
}

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  return dp;
}

export function diffLines(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const dp = lcs(a, b);
  const out: DiffLine[] = [];
  let i = 0, j = 0;
  let oldNo = 1, newNo = 1;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push({ op: "ctx", text: a[i], oldNo: oldNo++, newNo: newNo++ });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ op: "del", text: a[i], oldNo: oldNo++ });
      i++;
    } else {
      out.push({ op: "add", text: b[j], newNo: newNo++ });
      j++;
    }
  }
  while (i < a.length) out.push({ op: "del", text: a[i++], oldNo: oldNo++ });
  while (j < b.length) out.push({ op: "add", text: b[j++], newNo: newNo++ });
  return out;
}

export interface FileDiff {
  path: string;
  status: "added" | "removed" | "modified";
  added: number;
  removed: number;
  lines: DiffLine[];
}

export function diffFileSets(
  before: { path: string; content: string }[],
  after: { path: string; content: string }[],
): FileDiff[] {
  const beforeMap = new Map(before.map((f) => [f.path, f.content]));
  const afterMap = new Map(after.map((f) => [f.path, f.content]));
  const allPaths = new Set([...beforeMap.keys(), ...afterMap.keys()]);
  const diffs: FileDiff[] = [];

  for (const path of allPaths) {
    const oldC = beforeMap.get(path);
    const newC = afterMap.get(path);
    if (oldC === newC) continue;
    const lines = diffLines(oldC ?? "", newC ?? "");
    const added = lines.filter((l) => l.op === "add").length;
    const removed = lines.filter((l) => l.op === "del").length;
    if (added === 0 && removed === 0) continue;
    diffs.push({
      path,
      status: oldC === undefined ? "added" : newC === undefined ? "removed" : "modified",
      added,
      removed,
      lines,
    });
  }
  return diffs.sort((a, b) => a.path.localeCompare(b.path));
}
