// 메인페이지 Trust Bar에서 사용하는 서비스 지표. 숫자를 JSX에 여러 곳
// 하드코딩하지 않고 이 파일 하나에서 관리한다. 값이 바뀌면 여기만 수정한다.
//
// cumulativeStudents(1.2K+)와 satisfaction(4.9 / 5)은 공식적으로 사용 가능한
// 값으로 확정되었다(sourceNoteVerified: true). 나머지 항목(강사진 조건,
// 언어 커버리지)은 공식 근거 없이 새로운 숫자/성과 수치를 추가하지 않는다.
export const trustStats = {
  cumulativeStudents: {
    value: "1.2K+",
    label: "누적 수강생",
  },
  satisfaction: {
    value: "4.9 / 5",
    label: "수강생 만족도",
  },
  instructorCondition: {
    // 강사진 조건은 임의로 단정하지 않고 안내받은 조건 문구를 그대로 사용한다.
    value: "전문 강사진",
    label: "원어민·교포 또는 자격 보유",
  },
  languageCoverage: {
    value: "3개 언어",
    label: "영어 · 일본어 · 중국어",
  },
  sourceNote: "파워 외국어 과정 누적 기준",
  sourceNoteVerified: true,
} as const;
