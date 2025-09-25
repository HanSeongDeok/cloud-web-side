import { Button } from "../ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  handleDownload: () => void;
}

const DownloadButton = ({ handleDownload }: DownloadButtonProps) => {
  return (
    <Button
      onClick={() => handleDownload()}
      variant="default"
      size="default"
      className="flex self-start w-35 sm:w-35 lg:w-35 h-12 sm:h-12 lg:h-12 justify-center text-sm sm:text-base 
                        cursor-pointer bg-white rounded-md hover:bg-gray-100/50 transition-colors border border-gray-300
                        hover:border-gray-400 focus-visible:ring-0"
    >
      <Download className="h-4 w-4" />
      다운로드
    </Button>
  );
};

export default DownloadButton;
