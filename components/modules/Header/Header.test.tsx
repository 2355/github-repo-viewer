import { render, screen } from "@testing-library/react";

import { Header } from "./Header";

describe("Header", () => {
  it("アプリ名を表示する", () => {
    render(<Header />);
    expect(screen.getByText("GitHub Repository Viewer")).toBeInTheDocument();
  });

  it("アプリ名が / へのリンクになっている", () => {
    render(<Header />);
    const link = screen.getByRole("link", {
      name: "GitHub Repository Viewer",
    });
    expect(link).toHaveAttribute("href", "/");
  });

  it("banner ロールの header 要素で描画される", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
