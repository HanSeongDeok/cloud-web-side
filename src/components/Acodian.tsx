import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { memo } from "react";
import ComboBox from "@components/ComboBox";
import LabelCom from "@components/Label";
import SelectCombo from "./SelectCombo";

const AccordionDemo = memo(() => {
    return (
        <Accordion
            type="single"
            collapsible
            style={{ backgroundColor: 'oklch(0.145 0 0)' }}
            className="w-full rounded-lg shadow-md"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1" className="rounded-md">
                <AccordionTrigger
                    className="!#000001 !py-3 bg-neutral-900 !text-white text-lg rounded-t-md">필터 영역 구성</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="flex flex-col my-4 ml-4 space-y-4">
                        <LabelCom />

                        <div className="flex flex-row space-x-4">
                            <SelectCombo/>
                            <SelectCombo/>
                            <SelectCombo/>
                            <SelectCombo/>
                        </div>
                    </div>
                    <p>
                        This is a test section.
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
});

export default AccordionDemo;