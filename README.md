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
src/
├── components/           # React 컴포넌트
│   ├── ui/              # Radix UI 기반 컴포넌트
│   ├── FileUploadList.tsx    # 파일 업로드 목록
│   ├── FileMetaEditor.tsx    # 파일 메타데이터 편집기
│   ├── UploadBox.tsx         # 파일 업로드 영역
│   ├── DataTable.tsx         # ag-grid 테이블
│   └── ...
├── stores/              # Zustand 상태 관리
│   ├── useFileSelectionStore.ts      # 파일 선택 상태
│   ├── useFileMultiSelectionStore.ts # 멀티 선택 상태
│   ├── useUploaderStore.ts           # 업로더 상태
│   └── ...
├── handlers/            # 이벤트 핸들러
│   ├── file.upload.handler.tsx       # 파일 업로드 처리
│   ├── dataTable.config.handler.tsx  # 테이블 설정
│   └── ...
├── hooks/               # 커스텀 React 훅
│   └── use-mobile.ts    # 모바일 감지 훅
├── styles/              # CSS 스타일
└── lib/                 # 유틸리티 함수
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

...

## 개발 도구
- **React DevTools** - React 컴포넌트 디버깅
- **TypeScript** - 타입 체크 및 자동완성

## 브라우저 지원
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
