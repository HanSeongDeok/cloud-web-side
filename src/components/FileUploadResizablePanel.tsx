import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "./ui/resizable";
import FileUploadList from "./FileUploadList";
import FileMetaEditor from "./FileMetaEditor";
import { memo } from "react";

const FileUploadResizablePanel = memo(() => {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={28} maxSize={50} className="p-2 border-r">
                <FileUploadList />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70} minSize={50} className="p-6">
                <FileMetaEditor />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
});

export default FileUploadResizablePanel;