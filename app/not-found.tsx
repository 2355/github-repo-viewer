import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>ページが見つかりません</h2>
      <p>お探しのページは存在しないか、削除された可能性があります。</p>
      <Link href="/">トップに戻る</Link>
    </div>
  );
}
