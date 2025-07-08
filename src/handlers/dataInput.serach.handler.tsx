import { useSearchKeywordStore } from "@/stores/useSearchKeywordStore";
import { debounce, throttle } from "lodash";

export const handleChangeDebounce = debounce((value: string) => {
  useSearchKeywordStore.getState().setSearchKeyword(value);
  console.log(value)
}, 200);

export const handleChangeThrottle = throttle((value: string) => {
  useSearchKeywordStore.getState().setSearchKeyword(value);
  console.log(value)
}, 200);

//TODO 실제 검색 버튼 클릭 시점 Backend 통신 핸들러 정의
export const onSearchClickThrottle = () => {
  handleChangeThrottle.flush();
}