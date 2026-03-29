# EDIT GUIDE

## 전체 구조

- `index.html`: 홈
- `bsc.html`: 학사 메인
- `msc.html`: 석사 메인
- `entry.html`: 과목/프로젝트/연구/세미나의 중간 상세 페이지
- `topic.html`: 최종 세부 페이지

실제 내용은 거의 모두 `data/site-data.js`에서 수정합니다.

## 홈 수정

`site`, `home` 항목을 수정하면 됩니다.

- 이름: `site.owner`
- 한 줄 소개: `site.tagline`
- 홈 설명: `site.intro`
- 프로필 사진: `site.photo`
- 링크: `site.links`
- 학력: `home.education`
- 대표 프로젝트: `home.projects`

## B.SC. / M.SC. 수정

`programs.bsc`, `programs.msc` 내부를 수정합니다.

- 상단 정보: `meta`
- 각 표: `tables`
- 각 표 안의 연도/구분: `groups`
- 실제 과목/프로젝트/연구명: `entries`

## 새 항목 추가 템플릿

```js
{
  id: "bsc-new-course",
  title: "새 과목명",
  credits: 3,
  summary: "짧은 설명",
  chapters: [
    {
      title: "큰 챕터명",
      topics: [
        {
          id: "new-topic-1",
          title: "소주제명",
          summary: "짧은 요약",
          notes: [
            {
              title: "정리 제목",
              text: "내용 정리"
            }
          ],
          attachments: [
            {
              label: "PPT 파일",
              href: "uploads/bsc/example.pptx"
            }
          ],
          gallery: [
            {
              title: "PPT 01",
              caption: "설명",
              image: "uploads/bsc/example-01.jpg"
            }
          ]
        }
      ]
    }
  ]
}
```

## PPT / 이미지 넣는 법

- 파일은 `uploads/bsc/` 또는 `uploads/msc/`에 넣습니다.
- 문서 링크는 `attachments`에 추가합니다.
- 이미지/PPT 캡처는 `gallery`에 추가합니다.
- `gallery`는 자동으로 3열 행렬 형태로 출력됩니다.

## 학점 표시

- 과목 단위 학점: 각 `entry.credits`
- 학년별 학점 합계: 각 `group.totalCredits`
- 전체 학점: 각 테이블의 `overallCredits`
