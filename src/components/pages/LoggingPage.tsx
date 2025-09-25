import LogHeader from "../log/logHeader";
import LogTable from "../log/logTable";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { redirectToOpenSearch } from "@/handlers/services/log.service.handler";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const LoggingPage: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, 400);
  const [timeRangeEnabled, setTimeRangeEnabled] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    // 최초 1회만 실행
    redirectToOpenSearch()
      .then((url) => setUrl(url))
      .catch((err) => {
        // 필요시 에러 처리
        setUrl("");
      });
  }, []);

  const handleStartTimeChange = (v: string) => {
    setStartTime(v);
  };

  const handleEndTimeChange = (v: string) => {
    setEndTime(v);
  };

  const handleClick = () => {
    window.location.href = `${url}`;
  };

  const handleClearKeyword = () => setKeyword("");
  const enableTimeFilter = () => {
    setTimeRangeEnabled(!timeRangeEnabled);
  };

  return (
    <main className="min-h-screen mr-5 ml-5">
      <div className="flex justify-between items-center  mt-6">
        <h2 className="text-2xl font-semibold">시스템 로그 모니터링</h2>
        <Button
          onClick={handleClick}
          variant={"outline"}
          size={"lg"}
          className="text-lg"
        >
          <SquareArrowOutUpRight className="mr-2" />
          상세 로그 보기
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <LogHeader
          keyword={keyword}
          onKeywordChange={setKeyword}
          onClearKeyword={handleClearKeyword}
          onEnableTimeFilter={enableTimeFilter}
          timeEnabled={timeRangeEnabled}
          onStartTimeChange={handleStartTimeChange}
          onEndTimeChange={handleEndTimeChange}
        />
        <LogTable
          keyword={debouncedKeyword}
          timeRangeEnabled={timeRangeEnabled}
          startTime={startTime}
          endTime={endTime}
        />
      </div>
    </main>
  );
};

export default LoggingPage;
