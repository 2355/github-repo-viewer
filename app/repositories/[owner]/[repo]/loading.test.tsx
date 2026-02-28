import { render, screen } from "@testing-library/react";

import Loading from "./loading";

describe("loading", () => {
  it("スケルトン要素が表示される", () => {
    render(<Loading />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("アバタースケルトンが表示される", () => {
    render(<Loading />);

    expect(screen.getByTestId("skeleton-avatar")).toBeInTheDocument();
  });

  it("統計情報のスケルトンが 4 つ表示される", () => {
    render(<Loading />);

    const statSkeletons = screen.getAllByTestId("skeleton-stat");
    expect(statSkeletons).toHaveLength(4);
  });
});
