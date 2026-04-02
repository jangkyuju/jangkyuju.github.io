# PhD Student Website Agent - 통합 설계서

> **역할**: 이 문서는 Claude Code에서 실제 구현 시 참조하는 계획서입니다.
> **작성일**: 2026-03-06
> **버전**: v1.1 (소스 코드 분석 반영)

---

## 1. 작업 컨텍스트

### 배경 및 목적

Figma Make로 기획된 PhD student 포트폴리오 React 코드를 받아, GitHub Jekyll + jekyll-chirpy theme 기반의 실제 배포 가능한 웹사이트를 자동으로 구축한다. 포트폴리오 사이트와 블로그를 단일 도메인(github.io)으로 통합 운영한다.

### 소스 코드 파악 결과 (src.zip 분석)

소스는 **React SPA** 구조다. 실제 라우트와 페이지 구성:

| React Route       | 컴포넌트             | 내용                                                                                               |
| ----------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `/`             | `Home.tsx`         | 히어로(프로필 사진+Bio+소셜링크+Research Interests) + News + Recent Posts (2-column grid)          |
| `/publications` | `Publications.tsx` | 연도별 논문 목록 + 통계 카드 + Peer Review Service                                                 |
| `/blog`         | `Blog.tsx`         | 블로그 포스트 목록 (카테고리/태그 필터)                                                            |
| `/blog/:slug`   | `BlogPost.tsx`     | 개별 포스트                                                                                        |
| `/analytics`    | `Analytics.tsx`    | **"Look who's here"** = 방문자 분석 대시보드 (Google Analytics + Looker Studio iframe embed) |
| `/contact`      | `Contact.tsx`      | 연락처 정보                                                                                        |

**Research/Projects** 전용 페이지 없음 → Home의 Research Interests 태그로만 존재
**CV** 전용 페이지 없음 → 상단 Nav의 "Download CV" 버튼 (PDF 링크)

### 디자인 시스템 (theme.css 추출)

| 토큰                | 라이트 모드               | 다크 모드          |
| ------------------- | ------------------------- | ------------------ |
| Primary             | `#1e3a8a` (네이비 블루) | `#fbbf24` (앰버) |
| Secondary           | `#fbbf24`               | `#2563eb`        |
| Accent              | `#dbeafe`               | `#1e3a8a`        |
| Background          | `#fafafa`               | `#111827`        |
| Card                | `#ffffff`               | `#1f2937`        |
| Muted               | `#ececf0`               | `#374151`        |
| Border-radius       | `0.625rem`              |                    |
| Font-size (base)    | `16px`                  |                    |
| Font-weight heading | `500 (medium)`          |                    |

네비게이션: **Top sticky navbar** (5개 항목 + CV Download 버튼 + 다크모드 토글)
푸터: 소셜 링크 아이콘 3개 + copyright

### 소스 기술 스택

- React + React Router v7 + Tailwind CSS v4 + Radix UI + shadcn/ui + lucide-react
- 패키지 관리: pnpm (package.json 확인)
- 빌드: Vite

### 범위

| 포함                                                   | 제외                    |
| ------------------------------------------------------ | ----------------------- |
| 정적 포트폴리오 페이지 구축 (5개 페이지)               | 동적 백엔드/DB 연동     |
| Chirpy 블로그 통합                                     | CMS 관리자 패널         |
| Google Analytics 추적 코드 삽입 + Looker Studio iframe | 커스텀 도메인 설정      |
| Human review 기반 반복 수정                            | 다국어(i18n) 지원       |
| 다크모드 토글                                          | React/JS SPA 기능 (CSR) |

### 입출력 정의

| 구분           | 내용                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **입력** | `src.zip` (React 컴포넌트 코드), `guidelines.zip` (Figma 가이드라인 - 현재 기본 템플릿만 포함) |
| **출력** | github.io 배포 가능한 Jekyll + Chirpy 프로젝트                                                     |

### 실제 페이지/섹션 (소스 기반 수정)

| Jekyll 페이지         | 소스                            | 주요 요소                                                                                               |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `index.html` (Home) | `Home.tsx`                    | 프로필 사진, Bio, 소셜 링크, Research Interests 태그, News 타임라인, Recent Posts                       |
| `publications.md`   | `Publications.tsx`            | 통계 카드(Total/Conference/Journal/Awards), 연도별 논문, 링크(PDF/arXiv/Code/Demo), Peer Review Service |
| Blog (Chirpy 기본)    | `Blog.tsx` + `BlogPost.tsx` | 카테고리(Research/Tutorial/News/Reflection), 태그                                                       |
| `analytics.md`      | `Analytics.tsx`               | "Look who's here" - GA 설정 가이드 + Looker Studio iframe + mock 통계 시각화                            |
| `contact.md`        | `Contact.tsx`                 | Email, LinkedIn, GitHub, 위치 정보                                                                      |

### 주요 제약조건

- **Top navbar 구현**: Chirpy는 기본적으로 sidebar 네비게이션 → 소스 디자인의 top navbar를 구현하려면 Chirpy layout override 필요
- Chirpy의 블로그 핵심 기능(검색, TOC, 다크모드, 태그/카테고리, RSS) 보존
- GitHub Pages 정적 사이트 제약 (서버 사이드 코드 없음)
- 데이터(`_data/*.yml`)로 콘텐츠와 레이아웃 분리 → 추후 사용자가 직접 업데이트 가능하게

### 용어 정의

| 용어            | 정의                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------- |
| Design Spec     | Analyzer Agent가 React 코드에서 추출한 구조화된 디자인 정보 (JSON)                            |
| Chirpy          | Jekyll 블로그 테마. 검색/TOC/다크모드/태그 내장. 기본 레이아웃은 sidebar                      |
| Human Review    | 사람이 배포된 사이트를 직접 확인하고 수정 피드백을 제공하는 단계                              |
| Full Rebuild    | 피드백 반영 후 Jekyll 프로젝트 전체를 재생성하는 방식                                         |
| Chirpy Override | `_layouts/`, `_includes/`, `assets/css/` 에 파일을 추가해 Chirpy 기본값을 덮어쓰는 방식 |

---

## 2. 워크플로우 정의

### 전체 흐름도

```
[입력: src.zip (React 코드)]
        |
        v
[Step 1] Analyze
  code-analyzer 서브에이전트
  → /output/design-spec.json
        |
        v
[Step 2] Build
  jekyll-builder 서브에이전트
  → Jekyll 프로젝트 파일 생성
  → git push → github.io 배포
        |
        v
[Step 3] Human Review (웹 구조 & 기능 검토)
  - 통과 → Step 5로 이동
  - 수정 필요 → Step 4
        |
        v
[Step 4] Apply Feedback
  review-implementer 서브에이전트
  → design-spec.json 업데이트
  → jekyll-builder 재호출 (Full Rebuild)
  → 재배포
        |
        v
  [Step 3으로 루프 반복]
        |
        v
[Step 5] 최종 Human Review (완성 결과물 검토)
  - 통과 → 완료
  - 부분 수정 → Step 6
        |
        v
[Step 6] Quick Fix
  review-implementer 서브에이전트 (경량 모드)
  → 지적된 파일/섹션만 타깃 수정
  → 재배포
        |
        v
[완료: 최종 사이트 URL 전달]
```

### 단계별 상세 정의

#### Step 1: Analyze (코드 분석)

| 항목                    | 내용                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **담당**          | code-analyzer 서브에이전트                                                                                                                                         |
| **입력**          | `docs/figma-source/` 내 파일들 (src.zip 압축 해제 결과)                                                                                                          |
| **LLM 처리**      | 각 페이지 컴포넌트의 콘텐츠 구조/레이아웃 패턴 해석, 색상/폰트 토큰 추출 (theme.css), 네비게이션 구조 파악, 데이터 구조 파악 (Publications 배열, NewsItem 배열 등) |
| **스크립트 처리** | src.zip 압축 해제, 파일 목록 추출                                                                                                                                  |
| **출력**          | `/output/design-spec.json`                                                                                                                                       |
| **성공 기준**     | 5개 페이지 모두 매핑됨, 색상 토큰 12개 이상 존재, 네비게이션 항목 목록 정의됨, 각 페이지의 데이터 스키마 정의됨                                                    |
| **검증 방법**     | 스키마 검증 (필수 필드 존재 여부)                                                                                                                                  |
| **실패 시**       | 자동 재시도 1회 → 누락 항목 목록 명시 후 에스컬레이션                                                                                                             |

#### Step 2: Build (Jekyll 구축 + 배포)

| 항목                    | 내용                                                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **담당**          | jekyll-builder 서브에이전트                                                                                                                                                             |
| **입력**          | `/output/design-spec.json`                                                                                                                                                            |
| **스크립트 처리** | Jekyll 디렉토리 구조 생성,`_config.yml` 작성, `_data/*.yml` 생성 (publications, news, nav 등), `_layouts/*.html` 생성, `_includes/*.html` 생성, `assets/css/custom.scss` 생성 |
| **LLM 판단 영역** | Top navbar 구현 방식 결정 (Chirpy sidebar 완전 교체 vs 오버라이드), 각 페이지별 Chirpy 레이아웃 재사용 가능 범위 판단                                                                   |
| **출력**          | Jekyll 프로젝트 파일 전체, github.io 배포 완료 URL                                                                                                                                      |
| **성공 기준**     | `bundle exec jekyll build` 오류 없음, 5개 페이지 URL 접근 가능, 블로그 카테고리/태그 작동, 다크모드 토글 작동                                                                         |
| **검증 방법**     | 규칙 기반 (빌드 성공 여부, 페이지 URL 확인)                                                                                                                                             |
| **실패 시**       | 자동 재시도 1회 (빌드 오류 수정) → 에스컬레이션                                                                                                                                        |

#### Step 3: Human Review (반복)

| 항목                | 내용                           |
| ------------------- | ------------------------------ |
| **담당**      | 사람                           |
| **입력**      | 배포된 github.io URL           |
| **출력**      | 수정 피드백 텍스트 또는 "승인" |
| **성공 기준** | 사람이 "승인" 판정             |
| **검증 방법** | 사람 검토                      |
| **실패 시**   | Step 4로 전달                  |

#### Step 4: Apply Feedback (피드백 반영 + Full Rebuild)

| 항목                | 내용                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------- |
| **담당**      | review-implementer → jekyll-builder                                                        |
| **입력**      | 피드백 텍스트,`/output/design-spec.json`                                                  |
| **LLM 판단**  | 피드백을 design-spec 변경사항으로 해석, 영향 받는 섹션 파악, 레이아웃 일관성 유지 방식 결정 |
| **처리**      | design-spec.json 업데이트 → jekyll-builder 전체 재빌드 → 재배포                           |
| **출력**      | 업데이트된 `/output/design-spec.json`, `/output/change-log.md`                          |
| **성공 기준** | 피드백 항목 전부 change-log에 반영됨, 빌드 성공                                             |
| **검증 방법** | LLM 자기 검증 (피드백 항목 대조) + 규칙 기반 (빌드 성공)                                    |
| **실패 시**   | 이해 불가능한 피드백 → 에스컬레이션 (재질문), 빌드 실패 → 자동 재시도 1회                 |

#### Step 5: 최종 Human Review

Step 3과 동일. 이 단계 통과 후 "완성" 상태로 전환.

#### Step 6: Quick Fix

| 항목                | 내용                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| **담당**      | review-implementer 서브에이전트 (경량 모드)                               |
| **입력**      | 최종 수정 지적사항 (범위 제한적)                                          |
| **처리**      | 지적된 파일/섹션만 타깃 수정, 전체 재빌드 없이 변경 파일만 교체 후 재배포 |
| **성공 기준** | 지적 항목 반영 + 빌드 성공                                                |
| **검증 방법** | LLM 자기 검증 + 빌드 확인                                                 |
| **실패 시**   | Step 4 방식(Full Rebuild)으로 에스컬레이션                                |

### 분기 조건 요약

| 조건                    | 다음 단계             |
| ----------------------- | --------------------- |
| Step 1 분석 완료        | Step 2                |
| Step 2 빌드 성공        | Step 3 (Human Review) |
| Step 3 "승인"           | Step 5 (최종 리뷰)    |
| Step 3 수정 피드백 있음 | Step 4                |
| Step 4 반영 완료        | Step 3 (루프)         |
| Step 5 "승인"           | 완료                  |
| Step 5 부분 수정 필요   | Step 6                |
| Step 6 완료             | 완료                  |

---

## 3. 구현 스펙

### 폴더 구조

```
/web_dev_githubpage/                     # GitHub Pages 프로젝트 루트 (= git repo)
├── CLAUDE.md                            # 메인 에이전트 지침 (오케스트레이터)
├── _config.yml                          # Jekyll + Chirpy 설정
├── Gemfile                              # Ruby gem 의존성
│
├── _data/                               # 콘텐츠 데이터 (YAML, 사용자가 직접 편집)
│   ├── nav.yml                          # 네비게이션 항목
│   ├── publications.yml                 # 논문 목록
│   ├── news.yml                         # News 항목
│   └── profile.yml                      # 이름, 소속, Bio, 소셜 링크, Research Interests
│
├── _layouts/                            # 커스텀 레이아웃 (Chirpy override)
│   ├── home.html                        # Home 페이지 전용
│   ├── publications.html                # Publications 페이지 전용
│   ├── analytics.html                   # "Look who's here" 페이지 전용
│   └── contact.html                     # Contact 페이지 전용
│
├── _includes/                           # 재사용 컴포넌트 (Chirpy override)
│   ├── topbar.html                      # Top sticky navbar (Chirpy sidebar 대체)
│   ├── footer.html                      # 커스텀 푸터
│   ├── profile-hero.html                # 홈 히어로 섹션
│   ├── news-section.html                # News 타임라인
│   └── publication-card.html            # 논문 카드 컴포넌트
│
├── _pages/                              # 정적 페이지
│   ├── publications.md                  # layout: publications
│   ├── analytics.md                     # layout: analytics ("Look who's here")
│   └── contact.md                       # layout: contact
│
├── _posts/                              # 블로그 포스트 (Chirpy 기본 구조)
│   └── YYYY-MM-DD-title.md
│
├── assets/
│   ├── css/
│   │   └── custom.scss                  # Figma 디자인 토큰 CSS 변수 + Chirpy 오버라이드
│   ├── img/
│   │   └── profile.jpg                  # 프로필 사진
│   └── cv.pdf                           # CV 다운로드 파일
│
├── index.html                           # Home 페이지 (layout: home)
│
├── /.claude/
│   ├── /skills/
│   │   ├── /react-parser/
│   │   │   ├── SKILL.md
│   │   │   ├── /scripts/                # zip 압축 해제, 파일 목록 추출 스크립트
│   │   │   └── /references/
│   │   │       └── chirpy-structure.md  # Chirpy 파일 구조 + override 방법 참조
│   │   ├── /jekyll-scaffold/
│   │   │   ├── SKILL.md
│   │   │   ├── /scripts/                # Jekyll 파일 생성, YAML 데이터 파일 생성
│   │   │   └── /references/
│   │   │       └── chirpy-override.md   # Chirpy layout/include override 패턴
│   │   └── /git-deploy/
│   │       ├── SKILL.md
│   │       └── /scripts/                # bundle exec jekyll build + git push
│   │
│   └── /agents/
│       ├── /code-analyzer/
│       │   └── AGENT.md
│       ├── /jekyll-builder/
│       │   └── AGENT.md
│       └── /review-implementer/
│           └── AGENT.md
│
├── /output/
│   ├── design-spec.json                 # Step 1 산출물
│   └── change-log.md                    # 리뷰 루프별 변경 이력
│
└── /docs/
    └── figma-source/                    # src.zip 압축 해제 결과
        ├── app/pages/                   # React 페이지 컴포넌트
        ├── app/components/              # Layout, UI 컴포넌트
        └── styles/                      # theme.css (디자인 토큰 원본)
```

### CLAUDE.md 핵심 섹션 목록

1. 에이전트 역할 및 오케스트레이터 책임
2. 소스 파일 위치: `docs/figma-source/` (분석 대상), `output/` (중간 산출물)
3. 서브에이전트 호출 시점 및 방법
4. Human Review 대기: `AskUserQuestion` 사용, 사이트 URL과 함께 피드백 요청
5. 데이터 전달 규칙 (`/output/` 경로 기반)
6. 실패 처리 원칙 (재시도 횟수 명시)

### 에이전트 구조

**메인 에이전트 (오케스트레이터)**

- CLAUDE.md 기반
- 전체 워크플로우 흐름 제어
- 서브에이전트 호출 및 결과 수신
- Human Review 요청 및 피드백 수집

**서브에이전트 3종**

| 에이전트               | 역할                                               | 트리거                        |
| ---------------------- | -------------------------------------------------- | ----------------------------- |
| `code-analyzer`      | React 코드 파싱 → design-spec.json 생성           | Step 1 (최초 1회)             |
| `jekyll-builder`     | design-spec → Jekyll 전체 파일 생성 + 배포        | Step 2, Step 4 Full Rebuild   |
| `review-implementer` | 피드백 해석 → design-spec 업데이트 또는 Quick Fix | Step 4 (Full), Step 6 (Quick) |

### 스킬 목록

| 스킬                | 역할                                                                                                         | 트리거 조건                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `react-parser`    | src.zip 압축 해제, 페이지 컴포넌트·theme.css 읽기, 구조 추출                                                | `code-analyzer` 호출, Step 1에서만     |
| `jekyll-scaffold` | `_config.yml`, `_data/*.yml`, `_layouts/*.html`, `_includes/*.html`, `assets/css/custom.scss` 생성 | `jekyll-builder` 호출, Step 2 + Step 4 |
| `git-deploy`      | `bundle exec jekyll build` → `git add/commit/push` → 배포 확인                                         | `jekyll-builder` 완료 후 항상          |

### 서브에이전트 상세

#### `code-analyzer`

| 항목                     | 내용                                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **역할**           | React 컴포넌트 + CSS에서 디자인 시스템 + 페이지별 콘텐츠 구조를 design-spec.json으로 추출                                                            |
| **입력**           | `docs/figma-source/` 경로                                                                                                                          |
| **분석 대상 파일** | `styles/theme.css` (토큰), `app/components/Layout.tsx` (nav/footer 구조), `app/pages/*.tsx` (각 페이지 구조), `app/routes.tsx` (라우트 매핑) |
| **출력**           | `/output/design-spec.json`                                                                                                                         |
| **참조 스킬**      | `react-parser`                                                                                                                                     |
| **데이터 전달**    | 파일 기반                                                                                                                                            |

#### `jekyll-builder`

| 항목                     | 내용                                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **역할**           | design-spec을 실제 Jekyll + Chirpy 파일로 변환, 전체 프로젝트 생성 및 배포                                            |
| **입력**           | `/output/design-spec.json`                                                                                          |
| **핵심 판단 사항** | Chirpy의 sidebar를 top navbar로 교체하는 방식 (`.claude/skills/jekyll-scaffold/references/chirpy-override.md` 참조) |
| **출력**           | Jekyll 프로젝트 파일들 (루트에 직접 생성), 배포 완료 URL                                                              |
| **참조 스킬**      | `jekyll-scaffold`, `git-deploy`                                                                                   |
| **데이터 전달**    | 배포 URL을 메인에 인라인 반환                                                                                         |

#### `review-implementer`

| 항목                  | 내용                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **역할**        | Human Review 피드백을 해석하여 design-spec 업데이트(Full) 또는 Jekyll 파일 직접 수정(Quick)                       |
| **입력**        | 피드백 텍스트,`/output/design-spec.json`, 모드 플래그 (`full` or `quick`)                                   |
| **출력**        | 업데이트된 `/output/design-spec.json` (Full), 또는 수정된 파일 목록 (Quick), `/output/change-log.md` 업데이트 |
| **참조 스킬**   | `jekyll-scaffold` (Quick Fix 시 부분 파일 재생성)                                                               |
| **데이터 전달** | 파일 기반                                                                                                         |

### 주요 산출물 파일 형식

#### `/output/design-spec.json` 구조 (소스 기반 구체화)

```json
{
  "meta": {
    "source": "docs/figma-source/",
    "extracted_at": "YYYY-MM-DDTHH:mm:ssZ",
    "source_routes": ["/", "/publications", "/blog", "/analytics", "/contact"]
  },
  "design_system": {
    "colors": {
      "light": {
        "primary": "#1e3a8a",
        "secondary": "#fbbf24",
        "accent": "#dbeafe",
        "background": "#fafafa",
        "card": "#ffffff",
        "muted": "#ececf0",
        "border_radius": "0.625rem"
      },
      "dark": {
        "primary": "#fbbf24",
        "secondary": "#2563eb",
        "accent": "#1e3a8a",
        "background": "#111827",
        "card": "#1f2937"
      }
    },
    "typography": {
      "base_size": "16px",
      "heading_weight": 500,
      "body_weight": 400
    },
    "layout": {
      "nav_type": "top-sticky",
      "max_width": "5xl (64rem)",
      "nav_items": ["Home", "Publications", "Blog", "Look who's here", "Contact"],
      "nav_extras": ["Download CV (PDF)", "Dark mode toggle"]
    }
  },
  "pages": {
    "home": {
      "layout": "home",
      "sections": ["hero", "news", "recent_posts"],
      "hero_fields": ["profile_image", "name", "affiliation", "bio", "social_links", "research_interests"],
      "data_sources": ["_data/profile.yml", "_data/news.yml", "_posts/"]
    },
    "publications": {
      "layout": "publications",
      "sections": ["stats_cards", "publications_by_year", "peer_review_service"],
      "pub_fields": ["title", "authors", "venue", "year", "type", "status", "links", "award"],
      "data_sources": ["_data/publications.yml"]
    },
    "blog": {
      "layout": "chirpy_default",
      "categories": ["Research", "Tutorial", "News", "Reflection"],
      "features": ["tag_filter", "category_filter", "search", "TOC"]
    },
    "analytics": {
      "layout": "analytics",
      "title": "Look who's here",
      "sections": ["ga_setup_guide", "looker_studio_iframe", "mock_stats_fallback"],
      "notes": "iframe embed placeholder for Google Looker Studio"
    },
    "contact": {
      "layout": "contact",
      "fields": ["email", "linkedin", "github", "location", "office"]
    }
  }
}
```

#### `/output/change-log.md` 구조

```markdown
## Review Round N - YYYY-MM-DD
### 피드백 원문
...
### 변경 항목
- [페이지명] 변경 내용
### 영향받은 파일
- _layouts/xxx.html
- _data/xxx.yml
```

---

## 4. 핵심 기술 과제 (구현 시 주의)

### [과제 1] Top Navbar vs Chirpy Sidebar

**문제**: Chirpy 기본 구조는 sidebar 네비게이션. 소스 디자인은 top sticky navbar.

**해결 방향** (jekyll-builder가 판단):

- `_layouts/default.html` override → sidebar 레이아웃 제거
- `_includes/topbar.html` 신규 생성 → 소스 Layout.tsx의 nav 구조 재현
- Chirpy의 다크모드/검색 기능은 JS 레벨에서 유지

### [과제 2] React 컴포넌트 → Liquid 템플릿 변환

| React                      | Jekyll/Liquid 대응                               |
| -------------------------- | ------------------------------------------------ |
| `Publications.tsx` 배열  | `_data/publications.yml` + Liquid `for` loop |
| `newsItems` 배열         | `_data/news.yml`                               |
| `researchInterests` 배열 | `_data/profile.yml`                            |
| `Link to=`               | `<a href=>`                                    |
| `className`              | `class`                                        |
| `{darkMode ? ... : ...}` | Chirpy 내장 다크모드 JS 활용                     |
| `ImageWithFallback`      | `<img>` + CSS fallback                         |

### [과제 3] Analytics 페이지 (Look who's here)

- Google Analytics 트래킹 코드: `_config.yml`의 `google_analytics` 필드로 삽입
- Looker Studio iframe: `analytics.md`에 placeholder `<!-- LOOKER_STUDIO_EMBED_URL -->` 삽입 → 사용자가 직접 URL 교체
- Mock 통계 시각화: 순수 CSS/HTML로 간략히 구현 (실제 연결 전 시각적 예시)

### [과제 4] Chirpy 블로그와 커스텀 페이지 공존

- Chirpy의 `_config.yml` permalink, collections 설정 유지
- `_pages/` 디렉토리에 커스텀 페이지 배치 (Chirpy 관례)
- 블로그 기능 (검색, TOC, 태그) → Chirpy 기본값 그대로 사용

---

## 5. 설계 결정 근거

| 결정                                   | 근거                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| 멀티 에이전트 선택                     | React 분석, Jekyll 구축, 피드백 반영은 도메인 지식이 다르며 단계별 컨텍스트 최적화 필요 |
| Full Rebuild 방식                      | 레이아웃 일관성 유지가 핵심. 부분 패치 시 섹션 간 스타일 불일치 위험                    |
| `_data/*.yml` 콘텐츠 분리            | 구현 후 사용자가 코드 없이 콘텐츠(논문, 뉴스 등) 업데이트 가능                          |
| design-spec.json 중간 산출물           | 분석-구축 단계 데이터가 크고 구조화됨. 파일 기반 전달로 컨텍스트 절약                   |
| change-log.md                          | 반복 리뷰 루프에서 변경 이력 추적 및 회귀 방지                                          |
| Chirpy Override (교체 아닌 오버라이드) | Chirpy gem 업데이트에도 커스텀 파일이 유지되도록                                        |
| "Look who's here" = Analytics 페이지   | 소스 코드 확인: Analytics.tsx = GA + Looker Studio viewer. 협력자 소개 페이지 아님      |
