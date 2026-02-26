import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("navigation ロールで描画される", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(
      screen.getByRole("navigation", { name: "pagination" }),
    ).toBeInTheDocument();
  });

  it("totalPages が 7 以下のとき、全ページ番号ボタンが表示される", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    for (let i = 1; i <= 5; i++) {
      expect(
        screen.getByRole("button", { name: String(i) }),
      ).toBeInTheDocument();
    }
  });

  it("現在ページのボタンに aria-current='page' が付与される", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "1" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("最初のページで「前へ」ボタンが disabled になる", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "前のページへ" })).toBeDisabled();
  });

  it("最後のページで「次へ」ボタンが disabled になる", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "次のページへ" })).toBeDisabled();
  });

  it("ページ番号をクリックすると onPageChange が呼ばれる", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("「前へ」をクリックすると onPageChange(currentPage - 1) が呼ばれる", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "前のページへ" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("「次へ」をクリックすると onPageChange(currentPage + 1) が呼ばれる", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "次のページへ" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("totalPages が 8 以上のとき、省略記号が表示される", () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />,
    );
    expect(screen.getByText("…")).toBeInTheDocument();
  });

  describe("ページ番号の表示ロジック", () => {
    it.each([
      { currentPage: 1, pages: [1, 2, 3, 4, 5, 10], ellipses: 1 },
      { currentPage: 2, pages: [1, 2, 3, 4, 5, 10], ellipses: 1 },
      { currentPage: 3, pages: [1, 2, 3, 4, 5, 10], ellipses: 1 },
      { currentPage: 4, pages: [1, 2, 3, 4, 5, 10], ellipses: 1 },
      { currentPage: 5, pages: [1, 4, 5, 6, 10], ellipses: 2 },
      { currentPage: 6, pages: [1, 5, 6, 7, 10], ellipses: 2 },
      { currentPage: 7, pages: [1, 6, 7, 8, 9, 10], ellipses: 1 },
      { currentPage: 8, pages: [1, 6, 7, 8, 9, 10], ellipses: 1 },
      { currentPage: 9, pages: [1, 6, 7, 8, 9, 10], ellipses: 1 },
      { currentPage: 10, pages: [1, 6, 7, 8, 9, 10], ellipses: 1 },
    ])(
      "totalPages が 10 で currentPage が $currentPage のとき、ページ $pages / 省略記号 $ellipses 個になること",
      ({ currentPage, pages, ellipses }) => {
        render(
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={() => {}}
          />,
        );
        for (const n of pages) {
          expect(
            screen.getByRole("button", { name: String(n) }),
          ).toBeInTheDocument();
        }
        expect(screen.getAllByText("…")).toHaveLength(ellipses);
      },
    );
  });
});
