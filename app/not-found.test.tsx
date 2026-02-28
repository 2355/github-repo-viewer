import { render, screen } from "@testing-library/react";

import NotFound from "./not-found";

describe("not-found", () => {
  it("見出しが表示される", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "ページが見つかりません" }),
    ).toBeInTheDocument();
  });

  it("メッセージが表示される", () => {
    render(<NotFound />);

    expect(
      screen.getByText(
        "お探しのページは存在しないか、削除された可能性があります。",
      ),
    ).toBeInTheDocument();
  });

  it("「トップに戻る」リンクが / を指す", () => {
    render(<NotFound />);

    const link = screen.getByRole("link", { name: "トップに戻る" });
    expect(link).toHaveAttribute("href", "/");
  });
});
