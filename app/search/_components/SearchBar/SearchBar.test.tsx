import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("search ロールの form 要素で描画される", () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("searchbox ロールの入力欄が表示される", () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(
      screen.getByRole("searchbox", { name: "検索キーワード" }),
    ).toBeInTheDocument();
  });

  it("検索ボタンが表示される", () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(
      screen.getByRole("button", { name: "検索" }),
    ).toBeInTheDocument();
  });

  it("defaultValue が入力欄の初期値に反映される", () => {
    render(<SearchBar defaultValue="react" onSearch={() => {}} />);
    expect(
      screen.getByRole("searchbox", { name: "検索キーワード" }),
    ).toHaveValue("react");
  });

  it("検索ボタンクリックで入力値を引数に onSearch が呼ばれる", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(
      screen.getByRole("searchbox", { name: "検索キーワード" }),
      "next.js",
    );
    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(onSearch).toHaveBeenCalledWith("next.js");
  });

  it("Enter キーでフォーム送信される", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(
      screen.getByRole("searchbox", { name: "検索キーワード" }),
      "next.js{Enter}",
    );

    expect(onSearch).toHaveBeenCalledWith("next.js");
  });

  it("空白のみの入力では onSearch が呼ばれず、バリデーションメッセージが表示される", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(
      screen.getByRole("searchbox", { name: "検索キーワード" }),
      "   {Enter}",
    );

    expect(onSearch).not.toHaveBeenCalled();
    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent("検索キーワードを入力してください");
  });

  it("空の入力では onSearch が呼ばれず、バリデーションメッセージが表示される", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent("検索キーワードを入力してください");
  });

  it("バリデーションエラー表示後、入力を始めるとメッセージが消える", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: "検索" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: "検索キーワード" }),
      "a",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
