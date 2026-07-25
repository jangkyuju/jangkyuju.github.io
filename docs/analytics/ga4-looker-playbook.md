# GA4 활용 및 Looker Studio 개선 실행안

이 문서는 `jangkyuju.github.io` 학술 포트폴리오의 운영 명세다. 목표는 단순
트래픽이 아니라, 어떤 방문이 연구 관심과 실제 연결 행동으로 이어지는지 판단하는
것이다.

## 1. 분석 질문과 KPI

### 핵심 질문

1. Discovery: 어떤 채널·캠페인·랜딩 페이지가 의미 있는 방문을 만드는가?
2. Research interest: 어떤 논문·프로젝트·글이 깊은 관심을 받는가?
3. Outcome: CV, 논문, 코드, Scholar, 이메일 등 다음 행동으로 이어지는가?
4. UX quality: 모바일이나 특정 페이지에서 참여가 비정상적으로 낮은가?
5. Update impact: 새 논문·발표·글 공개 뒤 7일/28일 성과가 개선되는가?

### North-star

`Academic action sessions / Sessions`

한 세션에서 다음 이벤트가 한 번 이상 발생하면 academic action으로 본다.

- Primary: `cv_download`, `email_click`, `contact_intent`,
  `publication_*_click`, `project_*_click`, `scholar_click`
- Secondary: `github_click`, `linkedin_click`

반복 클릭에 의해 부풀지 않도록 이벤트 수보다 사용자 또는 세션 기준을 우선한다.

### 진단 KPI

- Active users, New users, Sessions, Engaged sessions
- Engagement rate, Average engagement time per session
- Views per session, Returning-user share
- Landing page별 engagement rate와 academic action rate
- Device category별 engagement와 action rate

### 우선 확인할 세 가지 관점

1. Device: desktop/mobile/tablet별 Sessions, Engagement rate, Average engagement
   time, Academic action rate를 비교한다. 화면 크기나 OS·브라우저는 문제가 발견될 때만
   운영자 페이지에서 drill-down한다.
2. Acquisition funnel: `Session default channel group → Landing page → Academic
   action type` 순서로 본다. Organic Search, Organic Social, Referral, Direct,
   Email, Unassigned를 기본 채널로 사용하고 source/medium은 운영자용 상세 표에 둔다.
3. Geography: Country → Region → City 계층으로 탐색한다. City는 저빈도 방문자를
   특정하기 쉬우므로 운영자 전용으로 제한하고, 최소 Sessions 기준을 적용한다.

## 2. 구현된 이벤트 스키마

기존 이벤트 이름은 데이터 연속성을 위해 유지한다. 공통 파라미터는 다음과 같다.

| Parameter | 의미 | 예시 |
| --- | --- | --- |
| `content_type` | 행동 대상 | `publication`, `project`, `cv`, `contact`, `profile` |
| `content_id` | 제목에서 만든 분석 ID | `visual-complexity-of-head-up-display` |
| `content_title` | 논문/프로젝트 제목 | 사람이 읽는 제목 |
| `link_type` | 산출물 또는 목적지 유형 | `paper`, `arxiv`, `code`, `cv`, `email` |
| `link_placement` | 링크 위치 | `home_featured`, `publications_list`, `topbar` |
| `page_group` | 현재 페이지 그룹 | `home`, `publications`, `blog`, `contact` |
| `destination_host` | PII 없는 목적지 호스트 | `doi.org`, `github.com` |
| `contact_method` | 연락 방법 | `email_form` |

개인정보 보호를 위해 전체 `link_url`, `link_text`, 이메일 주소, 연락 폼 입력값,
검색어는 GA4로 보내지 않는다. Google Signals와 광고 개인화 신호도 태그 수준에서
비활성화했다.

## 3. GA4 Admin에서 할 일

### Custom definitions

Admin → Data display → Custom definitions에서 다음 event-scoped dimension을 등록한다.
등록 전 데이터에는 소급 적용되지 않으므로 등록일을 기록한다.

1. Content type → `content_type`
2. Content ID → `content_id`
3. Link type → `link_type`
4. Link placement → `link_placement`
5. Page group → `page_group`

`content_title`과 `destination_host`는 필요할 때 추가한다. 가능한 값이 과도하게 많은
dimension은 `(other)` 행을 늘릴 수 있으므로 최소화한다.

### Key events

초기에는 다음만 key event로 지정한다.

- `cv_download`
- `contact_intent`
- `email_click`

논문·프로젝트 링크 클릭은 핵심 KPI에는 포함하되 모두 key event로 지정하지 않는다.
데이터가 충분히 쌓인 뒤 Scholar 클릭을 후보로 검토한다.

### 데이터 품질

- Internal traffic rule로 소유자/개발 트래픽을 구분한다.
- Enhanced Measurement의 자동 `click`·`file_download`와 custom event를 합산하지 않는다.
- DebugView에서 대표 이벤트를 한 번씩 검증한다.
- Realtime → 24시간 뒤 Events report → Looker Studio 순으로 확인한다.

## 4. Looker Studio 구조

### 공개용: 1페이지

현재 `/analytics/` iframe은 공개용 별도 report를 사용한다.

- 최근 90일 Sessions, Active users, Engagement rate
- 주별 트렌드
- Session default channel group
- Content Group
- Top pages
- 표본이 충분할 때 Country 수준의 넓은 지역만 표시

공개 report에는 city, 정확한 referrer URL, 이메일·CV의 저빈도 세부 조합,
visitor-level 표, date × country drilldown을 넣지 않는다. 사용자 수가 10 미만인
셀은 숨기거나 `Other`로 묶는 것을 운영 원칙으로 삼는다.

### 운영자용: 4페이지

#### P1. Executive Overview

- Date control: 기본 28일, 이전 28일 비교
- Active users, Sessions, Engagement rate
- Academic action sessions/rate
- CV download sessions, Contact intent sessions
- 주별 trend
- Channel → Landing page → Academic action 흐름

#### P2. Discovery & Audience

- Default channel, source/medium, campaign
- Landing page
- Country(넓은 단위), device category
- Channel × Landing page의 engagement/action table
- Device category scorecard 및 device별 engagement/action comparison
- Acquisition funnel: Channel → Landing page → Academic action

권장 funnel 단계는 다음과 같다.

1. Entrances: Sessions by Session default channel group
2. Engaged visits: Engaged sessions by Landing page
3. Research interest: publication/project/blog engaged sessions
4. Academic action: CV, paper/code, Scholar, contact action sessions

이 흐름은 GA4의 실제 순차 경로를 재현하는 closed funnel이라기보다, 동일 기간의
세션 기반 성과 단계를 비교하는 운영용 funnel이다. 엄밀한 순서 분석이 필요하면 GA4
Explore의 Funnel exploration 또는 BigQuery event sequence를 사용한다.

#### P3. Research Content

- `content_type`, `content_id`, `content_title`
- Users, engaged sessions, average engagement time
- `link_type`별 artifact-click users/sessions
- publication/project 순위

#### P4. UX & Data Quality

- Device × Page engagement
- 404, `(not set)`, duplicate event audit
- Internal/self traffic
- Event volume와 parameter coverage trend
- Data source freshness/error

#### P5. Geography (운영자 전용)

- Country → Region → City drill-down table
- Sessions, Active users, Engagement rate, Academic action sessions
- Country/Region filter와 City search
- Sessions가 10 미만인 city row는 기본 필터로 제외
- `(not set)` 비율과 지역별 device mix 점검

공개 페이지에서는 Country 또는 충분히 집계된 Region까지만 보여준다. City 표는
공개 iframe과 다운로드 가능한 공개 데이터에 포함하지 않는다.

### 공통 필터

- Date range
- Content Group
- Device category
- Session default channel group

운영자용에만 Country, Source/medium, `content_type`, `link_type`,
new/returning 필터를 둔다. 핵심 KPI에서는 `/analytics/` 페이지 자체를 제외한다.

## 5. Looker Studio 계산 필드

### Content Group

```text
CASE
  WHEN Page path = "/" THEN "Home"
  WHEN REGEXP_MATCH(Page path, "^/publications") THEN "Publications"
  WHEN REGEXP_MATCH(Page path, "^/projects") THEN "Projects"
  WHEN REGEXP_MATCH(Page path, "^/blog") THEN "Blog"
  WHEN REGEXP_MATCH(Page path, "^/contact") THEN "Contact"
  WHEN REGEXP_MATCH(Page path, "^/cv") THEN "CV"
  WHEN REGEXP_MATCH(Page path, "^/analytics") THEN "Analytics"
  ELSE "Other"
END
```

### Academic Action Type

```text
CASE
  WHEN Event name = "cv_download" THEN "CV download"
  WHEN Event name IN ("email_click", "contact_intent") THEN "Contact intent"
  WHEN REGEXP_MATCH(Event name, "^publication_") THEN "Publication artifact"
  WHEN REGEXP_MATCH(Event name, "^project_") THEN "Project artifact"
  WHEN Event name = "scholar_click" THEN "Scholar profile"
  ELSE "Other"
END
```

### Traffic Intent

```text
CASE
  WHEN Session default channel group = "Organic Search" THEN "Search"
  WHEN REGEXP_MATCH(Session source, "(?i)scholar|researchgate") THEN "Academic referral"
  WHEN REGEXP_MATCH(Session source, "(?i)linkedin|github") THEN "Professional/social"
  WHEN Session source = "(direct)" THEN "Direct"
  ELSE "Other referral"
END
```

비율은 Event count를 Sessions로 단순 나누지 않는다. Date와 선택 breakdown을 키로
전체 sessions와 이벤트 필터가 적용된 sessions를 blend한 뒤
`Academic action sessions / Sessions`를 chart-specific metric으로 만든다.

## 6. UTM 규칙

논문, 발표, CV 공유 링크에 다음 규칙을 사용한다.

| 항목 | 예시 |
| --- | --- |
| `utm_source` | `linkedin`, `email`, `conference_qr`, `scholar` |
| `utm_medium` | `social`, `email`, `qr`, `referral` |
| `utm_campaign` | `paper_hud_2024`, `chi_2027_talk`, `phd_cv_2026` |
| `utm_content` | `post_body`, `profile_link`, `slide_final` |

개인 이름, 이메일, 회사 내부 코드 등 민감한 값을 UTM에 넣지 않는다.

## 7. 운영 리듬

### 매주 15분

1. 28일 vs 이전 28일 비교
2. Top channel, landing page, research content 확인
3. CV/contact/paper 행동 변화 확인
4. 다음 주에 바꿀 링크 배치 또는 콘텐츠 1개 결정

### 논문·발표 공개 시

1. 공개 전에 UTM 규칙 확정
2. 48시간 내 tracking sanity check
3. 7일과 28일 outcome review

### 매월

- `(not set)`, parameter coverage, duplicate clicks 확인
- 모바일 UX와 저성과 랜딩 페이지 점검
- 공개 report의 작은 셀과 개인정보 노출 점검
- data source credentials와 editor access 검토

## 8. 배포 전 검증

```powershell
node scripts/check-analytics.mjs
$env:JEKYLL_ENV='production'
bundle exec jekyll build --trace
```

production HTML에서 Google tag가 정확히 한 번 초기화되고, 대표 클릭 시 DebugView에
event name과 공통 파라미터가 나타나는지 확인한다. 서비스 계정 JSON, API secret,
GA export 원본은 저장소에 커밋하지 않는다.
