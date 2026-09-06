export function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.replace(/\/$/, "") || "/";
}

export function isNavActive(currentPath: string, href: string): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}
