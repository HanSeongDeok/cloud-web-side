import React from "react";
import { usePageStore } from "@/stores/useNavigateStore";
import ProtoPage1 from "@/components/pages/MainPage";
import ProtoPage2 from "@/components/pages/ProtoPage2";
import ProtoPage3 from "@/components/pages/ProtoPage3";
 

/**
 * 페이지 렌더링 핸들러
 * @returns 페이지 렌더링 핸들러
 */
// export const pageMap: Record<string, React.ComponentType> = {
//   page1: ProtoPage1,
//   page2: ProtoPage2,
//   page3: ProtoPage3,
// };

// const DynamicPage = (): (React.ReactNode) => {
//     return React.createElement(pageMap[usePageStore((state) => state.activePage)]);
// }

// export const PageRenderer = () => {
//   return <DynamicPage />
// };


export const DynamicPage = (): React.FC => {
  return usePageStore((state) => state.activePage);
}

export const PageRenderer = () => {
  const DynamicPageComponent = DynamicPage();
  return <DynamicPageComponent />
}
