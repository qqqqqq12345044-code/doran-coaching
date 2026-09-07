// 서버 컴포넌트로만 렌더링되는 JSON-LD 출력 전용 컴포넌트. "use client"를
// 붙이지 않아 클라이언트 번들/hydration에 영향을 주지 않는다. 화면 UI에는
// 아무것도 그리지 않고 <script type="application/ld+json">만 출력한다.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
