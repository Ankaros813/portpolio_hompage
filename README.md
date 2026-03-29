# 홈페이지_v2

학술 포트폴리오용 다단계 정적 홈페이지입니다.

## 로컬 실행

```bash
cd /Users/woo-seok_jeong/Desktop/홈페이지_v2
python3 -m http.server 5174
```

브라우저 접속:

```text
http://localhost:5174
```

## 주요 페이지

- `index.html`: 홈 화면
- `bsc.html`: 학사(B.SC.) 커리큘럼
- `msc.html`: 석사(M.SC.) 커리큘럼
- `entry.html`: 과목/프로젝트/연구/세미나 상세
- `topic.html`: 소주제 상세 + 내용/PPT 이미지 갤러리

## 가장 자주 수정하는 파일

- `data/site-data.js`: 전체 내용 데이터
- `assets/css/style.css`: 디자인
- `docs/EDIT_GUIDE.md`: 편집 설명서
