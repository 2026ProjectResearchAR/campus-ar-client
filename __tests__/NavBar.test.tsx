import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import NavBar from "@/componets/NavBar";

describe("NavBar", () => {
  test("タイトル・ロゴ・メニューボタンが表示される", () => {
    render(<NavBar />);
    expect(screen.getByText(/知能情報メディア課程.*研究室ガイド/)).toBeTruthy();
    expect(screen.getByAltText("Ryukoku Logo")).toBeTruthy();
    expect(screen.getByRole("button")).toBeTruthy();
  });

  test("bgColor 未指定なら bg-white、指定すればその色になる", () => {
    const { container, rerender } = render(<NavBar />);
    expect((container.firstChild as HTMLElement).className).toContain("bg-white");
    rerender(<NavBar bgColor="bg-red-500" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("bg-red-500");
    expect(cls).not.toContain("bg-white");
  });
});
