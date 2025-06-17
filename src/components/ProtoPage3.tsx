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
            className="p-4 bg-white rounded-lg shadow-md cursor-move hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="w-6 h-6 cursor-move">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 9h8M8 15h8" />
                    </svg>
                </div>
            </div>
            <div className="mt-2">
                {item.content}
            </div>
        </div>
    );
};

const ProtoPage3 = memo(() => {
    const [items, setItems] = useState<Item[]>([
        {
            id: "1",
            title: "차트 컴포넌트",
            content: (
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                    차트 컴포넌트
                </div>
            ),
        },
        {
            id: "2",
            title: "통계 컴포넌트",
            content: (
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                    통계 컴포넌트
                </div>
            ),
        },
        {
            id: "3",
            title: "목록 컴포넌트",
            content: (
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                    목록 컴포넌트
                </div>
            ),
        },
        {
            id: "4",
            title: "알림 컴포넌트",
            content: (
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                    알림 컴포넌트
                </div>
            ),
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
        <div className="p-6">
            <h1 className="text-2xl font-bold">Prototype Page THREE</h1>
            <p className="mt-4 text-muted-foreground">
                여기에 본문 콘텐츠가 들어갑니다.
            </p>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <SortableContext items={items} strategy={rectSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem key={item.id} item={item} />
                        ))}
                    </SortableContext>
                </div>

                <DragOverlay>
                    {activeItem ? (
                        <div className="p-4 bg-white rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{activeItem.title}</h3>
                            </div>
                            <div className="mt-2">
                                {activeItem.content}
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
});

export default ProtoPage3;