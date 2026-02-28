import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorPage from "./error";

describe("error", () => {
  const defaultProps = {
    error: new Error("テストエラー"),
    reset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("エラーメッセージが role='alert' で表示される", () => {
    render(<ErrorPage {...defaultProps} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("「再試行」ボタンをクリックすると reset() が呼ばれる", async () => {
    const user = userEvent.setup();
    render(<ErrorPage {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "再試行" }));

    expect(defaultProps.reset).toHaveBeenCalledTimes(1);
  });

  it("「検索に戻る」リンクが /search を指す", () => {
    render(<ErrorPage {...defaultProps} />);

    const link = screen.getByRole("link", { name: "検索に戻る" });
    expect(link).toHaveAttribute("href", "/search");
  });
});
