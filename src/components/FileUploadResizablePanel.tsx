import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "./ui/resizable";
import FileUploadList from "./FileUploadList";
import FileMetaEditor from "./FileMetaEditor";
import { memo } from "react";
import { usePannelResizableStore } from "@/stores/usePannelResizableStroe";

const FileUploadResizablePanel = memo(() => {
    const leftPanelWidth = usePannelResizableStore((state) => state.leftPanelWidth);
    const rightPanelWidth = usePannelResizableStore((state) => state.rightPanelWidth);
    const setLeftPanelWidth = usePannelResizableStore((state) => state.setLeftPanelWidth);
    const setRightPanelWidth = usePannelResizableStore((state) => state.setRightPanelWidth);
    const handleResize = (sizes: number[]) => {
        setLeftPanelWidth(sizes[0]);
        setRightPanelWidth(sizes[1]);
    };
    return (
        <ResizablePanelGroup 
            direction="horizontal" 
            onLayout={handleResize} 
        >
            <ResizablePanel defaultSize={leftPanelWidth} minSize={28} maxSize={50} className="p-2 border-r">
                <FileUploadList />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={rightPanelWidth} minSize={50} className="p-6">
                <FileMetaEditor />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
});

export default FileUploadResizablePanel;