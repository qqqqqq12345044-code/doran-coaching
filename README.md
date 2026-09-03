# 도란 DORAN

영어 · 일본어 · 중국어 1:1 화상 외국어 과외 서비스의 랜딩 사이트입니다.

## 기술 스택

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

## 개발 명령

| 명령                  | 설명              |
| --------------------- | ----------------- |
| `npm run dev`         | 로컬 개발 서버 실행 |
| `npm run build`       | 프로덕션 빌드      |
| `npm run start`       | 빌드된 앱 실행     |
| `npm run lint`        | ESLint 검사        |
| `npx tsc --noEmit`    | 타입 체크          |

## 배포

[Vercel](https://vercel.com)을 통해 배포합니다. Git 저장소를 Vercel 프로젝트에 연결하면
기본 브랜치에 push될 때마다 자동으로 빌드·배포됩니다.

- Production: https://dorancoaching.com
