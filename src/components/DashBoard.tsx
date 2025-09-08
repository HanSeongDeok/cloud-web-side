import { memo, useState } from "react";
import type { ReactNode } from "react";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Item {
    id: string;
    content: ReactNode;
    title: string;
    width: string;
    height: string;
}

const SortableItem = ({ item }: { item: Item }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`sortableItem ${item.width} ${item.height}`}
        >
            <div className="itemHeader">
                <h3 className="itemTitle">{item.title}</h3>
            </div>
            <div className="itemContent">
                {item.content}
            </div>
        </div>
    );
};

const DashBoard = memo(() => {
    const [items, setItems] = useState<Item[]>([
        {
            id: "1",
            title: "차트 컴포넌트",
            content: (
                <div className="chartContent">
                    차트 컴포넌트
                </div>
            ),
            width: "col-span-1",
            height: "h-60",
        },
        {
            id: "2",
            title: "통계 컴포넌트",
            content: (
                <div className="chartContent">
                    통계 컴포넌트
                </div>
            ),
            width: "col-span-1",
            height: "h-60",
        },
        {
            id: "3",
            title: "목록 컴포넌트",
            content: (
                <div className="chartContent">
                    목록 컴포넌트
                </div>
            ),
            width: "col-span-1",
            height: "h-60",
        },
        {
            id: "4",
            title: "알림 컴포넌트",
            content: (
                <div className="chartContent">
                    알림 컴포넌트
                </div>
            ),  
            width: "col-span-1",
            height: "h-60",
        },
    ]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    const activeItem = items.find((item) => item.id === activeId);

    return (
        <div>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="gridContainer">
                    <SortableContext items={items} strategy={rectSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem key={item.id} item={item} />
                        ))}
                    </SortableContext>
                </div>

                <DragOverlay>
                    {activeItem ? (
                        <div className="dragOverlay">
                            <div className="overlayHeader">
                                <h3 className="overlayTitle">{activeItem.title}</h3>
                            </div>
                            <div className="overlayContent">
                                {activeItem.content}
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
});

export default DashBoard;

