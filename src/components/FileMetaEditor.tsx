import { useFileInputStore } from "@/stores/useFileInputStore";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";
import { memo } from "react";
import { ScrollArea } from "./ui/scroll-area";

const FileMetaEditor = memo(() => {
    const file = useFileInputStore((state) => state.selectedFiles);
    return (
        <div>
            <div className="font-bold mb-2">메타데이터 편집: {file[0].name}</div>
            <div className="grid grid-cols-2 gap-4">
                <ScrollArea className="w-full h-100">
                    <div>
                        <Label className="block text-xs mb-1">Vehicle</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kona Electric">Kona Electric</SelectItem>
                                <SelectItem value="EV6">EV6</SelectItem>
                                <SelectItem value="GV80">GV80</SelectItem>
                                <SelectItem value="IONIQ 6">IONIQ 6</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
});

export default FileMetaEditor;