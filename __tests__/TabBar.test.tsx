import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ current: "/screen/map" }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

import TabBar from "@/componets/TabBar";

const href = (name: string) =>
  screen.getByRole("link", { name }).getAttribute("href");

describe("TabBar", () => {
  test("3つのタブが正しいリンク先で表示される", () => {
    render(<TabBar />);
    expect(href("マップ")).toBe("/screen/map");
    expect(href("スキャン")).toBe("/screen/scan");
    expect(href("マイページ")).toBe("/screen/mypage");
  });

  test("現在のパスに対応するタブだけがアクティブ表示になる", () => {
    pathname.current = "/screen/mypage";
    render(<TabBar />);
    const mypage = screen.getByRole("link", { name: "マイページ" });
    const map = screen.getByRole("link", { name: "マップ" });
    expect(mypage.className).toContain("text-brand");
    expect(map.className).toContain("text-ink");
    expect(map.className).not.toContain("text-brand");
  });
});
