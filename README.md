# Cloud Web Side

React 기반의 클라우드 웹 애플리케이션으로, 파일 업로드 및 메타데이터 편집 기능을 제공합니다.

## 주요 기능

### 파일 관리 시스템

- **드래그 앤 드롭 파일 업로드**: 직관적인 파일 업로드 인터페이스
- **멀티 파일 선택**: Ctrl, Shift 키를 이용한 고급 선택 기능
- **키보드 단축키 지원**:
  - `Ctrl + Click`: 개별 파일 선택/해제
  - `Shift + Click`: 범위 선택
- **컨텍스트 메뉴**: 우클릭으로 복사, 삭제, 일괄 적용 등 고급 기능
- **파일 메타데이터 편집**: 업로드된 파일의 상세 정보 관리

### 사용자 인터페이스

- **반응형 디자인**: 모바일 및 데스크톱 지원
- **다크 모드**: 테마 전환 기능

### 데이터 관리

- **ag-grid 테이블**: 변경 가능성 있음
- **상태 관리**: Zustand 상태 관리

## 기술 스택

### Frontend

- **React 18** - 사용자 인터페이스 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Vite** - 빠른 개발 서버 및 빌드 도구

### UI 컴포넌트

- **Radix UI** - 접근성이 뛰어난 UI 프리미티브
- **ag-grid Community** - 고성능 데이터 테이블
- **Lucide React** - 아이콘 라이브러리

### 상태 관리

- **Zustand** - 경량 상태 관리 라이브러리
- **React Hooks** - 컴포넌트 상태 관리(npx 경우에만)

## 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone [repository-url]
cd cloud-web-side

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 프로덕션 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
project-root/
├── public/           # 정적 파일 (이미지, 아이콘 등)
├── src/
│   ├── api/          # API 설정 및 엔드포인트
│   ├── assets/       # 프로젝트 자산 (이미지, 폰트 등)
│   ├── components/   # React 컴포넌트들
|   |   └──pages/        # 페이지 컴포넌트
│   │   └── ui/       # 여러 페이지에서 공통적으로 사용하는 컴포넌트
│   │   └──{페이지명}/   # ex(dashboard) 해당 페이지에서만 사용하는 컴포넌트
│   │   └── Header
│   │   └── Footer
│   ├── handlers/     # 이벤트 핸들러 및 로직
│   │   ├── services/ # 서비스 로직 (api controller)
│   │   └── events/   # 이벤트 처리 (event 처리)
│   ├── layouts/      # 레이아웃 컴포넌트
│   ├── routes/       # 라우팅 설정
│   ├── stores/        # 상태 관리 스토어
│   ├── hooks/        # 커스텀 React 훅
│   ├── lib/          # 유틸리티 라이브러리
│   ├── types/       # 데이터 모델 및 타입 정의
│   ├── stores/       # Zustand 상태 관리 스토어
│   ├── utils/        # 유틸리티 함수
│   ├── config/
│   ├── data/         # 테스트용 mock data 폴더(차후 삭제)
├── test/         # 테스트 파일
├── node_modules/     # npm 의존성 패키지
```

## 주요 컴포넌트 설명

### FileUploadList

- 파일 목록 표시 및 관리
- 멀티 선택 기능 (Ctrl, Shift 키 지원)
- 키보드 단축키 처리
- 컨텍스트 메뉴 (복사, 삭제, 일괄 적용)
- 파일 삭제 시 인덱스 자동 재조정

### FileMetaEditor

- 선택된 파일의 메타데이터 편집
- 동적 필드 추가/삭제
- 일괄 적용 기능
- 자동 채우기 기능

### UploadBox

- 드래그 앤 드롭 파일 업로드
- 파일 타입 검증
- 업로드 진행률 표시
- 중복 파일 처리

### DbPropertyTable

- 속성목록 표시 및 관리
- 멀티 선택 기능 (Ctrl, Shift 키 지원)
  ...

## 개발 도구

- **React DevTools** - React 컴포넌트 디버깅
- **TypeScript** - 타입 체크 및 자동완성

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 라우팅 경로 및 페이지

- 로그인 요청 화면
  `/login` - `LoginPage.tsx`
- 권한 요청 화면
  `/permission-request` - `PermissionPage.tsx`
- 로그인 화면(우리 페이지 아님)
- 메인 화면
  `/storage` - `StoragePage.tsx`
- 마이페이지
  `/my-page` - `MyPage.tsx`
- 휴지통
  `/trash` - `TrashPage.tsx`
- 대시보드
  `/dashboard` - `DashboardPage.tsx`
- 관리자
  `/admin` - `AdminPage.tsx`
  - 로그
    `/logging` - `LoggingPage.tsx`
  - DB 관리 - 속성 관리
    `/admin/db-config` - `DbConfig.tsx`
  - 화이트리스트
    `/whitelist` (Outlet 활용) - `WhitelistPage.tsx`
    `/admin/whitelist/list` - `WhitelistTab.tsx` - 화이트리스트 화면- 팀 구조
    `/admin/whitelist/requests` - `WhitelistRequestsTab.tsx` - 화이트리스트 화면 - 권한 요청
    `/admin/whitelist/managers` - `ManagersTab.tsx` - 화이트리스트 화면 - 관리자 관리
- 시스템 차단화면
  `/block` - `BlockPage.tsx`

## 상위 컴포넌트 테이블 렌더링 방식(DbConfigPage)

api 요청 쏘고 결과값으로 항상, 테이블이 리렌더링 되어야함.
┌─────────────────────────────────┐
│ | <DbConfigPage/>
|const [properties, setProperties]│ ← 상태 관리
│ handleSaveProperty() {...} │ ← 콜백 함수 (상태 변경)
└─────────────────────────────────┘
│ props
▼
┌─────────────────────────────────┐
│ <DbPropertyTable data={attrs}> │ ← 순수 컴포넌트 (상태 없음)
└─────────────────────────────────┘
│ props  
 ▼
┌─────────────────────────────────┐
│ <PropertyEditModal │
│ onSave={handleSaveProperty}> │ ← 콜백으로 상위 상태 변경
└─────────────────────────────────┘

### ✅ 개선된 구조

DbConfigPage: 모든 데이터 상태 중앙 관리
DbPropertyTable: 순수 렌더링 컴포넌트
PropertyEditModal: 입력받아서 상위로 전달만

## 전달 내용 ( rebase & merge 작업 끝나면 지우고 push 부탁드립니다.)

### Merge 내용 참고

- 기존 내용 중 삭제된 컴포넌트들 존재 : Home, layout, Sidebar, NavigationBar 등

### TODO

- useNavigateStore.ts 영구 삭제 필요 
- PermissionPage에서도 라우팅 방식을 Router.tsx 사용하도록 개선 필요
- ProtoaPage2, ProtoPage3 제거 필요 (대시보드 관련해서 구현된 로직이 있다면 DashboardPage.tsx 하위로 옮겨둘 것.)
