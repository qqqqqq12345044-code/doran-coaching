import { reviews } from "@/data/reviews";
import ReviewCard from "@/components/ReviewCard";

// 이 페이지에 실제로 해당하는 official-case 후기만 표시한다. reviewIds가
// 비어 있으면(또는 official-case가 아니면) 아무것도 렌더링하지 않는다 —
// 후기가 없다고 prototype으로 채우지 않는다.
export default function DetailReviews({ ids }: { ids: string[] }) {
  const list = reviews.filter((review) => review.sourceType === "official-case" && ids.includes(review.id));
  if (list.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]">실제 수강 사례</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
