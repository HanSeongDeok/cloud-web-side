import React from "react";
import { usePageStore } from "@/stores/useNavigateStore";
 

export const DynamicPage = (): React.FC => {
  return usePageStore((state) => state.activePage);
}

export const PageRenderer = () => {
  const DynamicPageComponent = DynamicPage();
  return <DynamicPageComponent />
}
