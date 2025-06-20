# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Cloud Web Side

React 기반의 클라우드 웹 애플리케이션입니다.

## 개발 도구

- [React DevTools](https://reactjs.org/link/react-devtools) - React 컴포넌트 디버깅 도구

## 주요 기능

- **ag-grid 테이블**: 고성능 데이터 테이블 컴포넌트
- **파일 업로드/다운로드**: 파일 관리 기능
- **반응형 디자인**: 모바일 및 데스크톱 지원
- **다크 모드**: 테마 전환 기능

## 기술 스택

- React 18
- TypeScript
- Tailwind CSS
- ag-grid Community
- Zustand (상태 관리)
- Radix UI (UI 컴포넌트)

## 설치 및 실행

```bash
npm install
npm run dev
```

## ag-grid 사용법

이 프로젝트는 ag-grid를 사용하여 고성능 데이터 테이블을 구현합니다:

- 정렬, 필터링, 페이지네이션 지원
- 컬럼 리사이징 및 드래그 앤 드롭
- 체크박스 선택 기능
- 커스텀 셀 렌더러

## 파일 구조

```
src/
├── components/
│   ├── DataTable.tsx      # ag-grid 테이블 컴포넌트
│   └── ...
├── handlers/
│   └── dataTable.config.handler.tsx  # ag-grid 설정
└── styles/
    └── DataTable.css      # ag-grid 커스텀 스타일
```
