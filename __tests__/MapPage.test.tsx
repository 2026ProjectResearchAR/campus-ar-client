import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MapPage from "@/app/screen/map/page";

const ALL = ["7号館", "図書館", "メインWC"];
const visiblePins = () => ALL.filter((n) => screen.queryByText(n));

describe("MapPage カテゴリフィルター", () => {
  test("初期状態では全ピンが表示される", () => {
    render(<MapPage />);
    expect(visiblePins()).toEqual(ALL);
  });

  test("カテゴリを選ぶと該当するピンだけが表示される", () => {
    render(<MapPage />);
    fireEvent.click(screen.getByRole("button", { name: "トイレ" }));
    expect(visiblePins()).toEqual(["メインWC"]);
  });

  test("該当ピンのないカテゴリではピンが表示されない", () => {
    render(<MapPage />);
    fireEvent.click(screen.getByRole("button", { name: "カフェ" }));
    expect(visiblePins()).toEqual([]);
  });

  test("選択中のカテゴリを再度押すと選択が解除され全ピンが表示される", () => {
    render(<MapPage />);
    fireEvent.click(screen.getByRole("button", { name: "研究室" }));
    expect(visiblePins()).toEqual(["7号館"]);
    fireEvent.click(screen.getByRole("button", { name: "研究室" }));
    expect(visiblePins()).toEqual(ALL);
  });
});
