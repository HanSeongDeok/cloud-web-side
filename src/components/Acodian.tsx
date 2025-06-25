import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { memo } from "react";
import "@styles/Acodian.css";
import SelectCombo from "@components/SelectCombo";
import LabelBase from "@/components/Label1";
import LabelCondition from "./Label2";
import { useAccordionStore } from "@/stores/useAccordionStore";

const AccordionLayout = memo(() => {
    const { openItems, setOpenItems } = useAccordionStore();
    return (
        <div className="accordionContainer">
            <Accordion
                type="multiple"
                style={{ backgroundColor: 'oklch(0.145 0 0)' }}
                className="accordion"
                value={openItems}
                onValueChange={setOpenItems}
            >
                <AccordionItem value="filter" className="accordionItem">
                    <AccordionTrigger className="accordionTrigger">필터 영역 구성</AccordionTrigger>
                    <AccordionContent className="accordionContent">
                        <div className="filterSection">
                            <LabelBase />
                            <div className="filterRow">
                                <SelectCombo />
                                <SelectCombo />
                                <SelectCombo />
                                <SelectCombo />
                            </div>
                        </div>
                        <div className="filterSection">
                            <LabelCondition />
                            <div className="filterRow">
                                <SelectCombo />
                                <SelectCombo />
                            </div>
                        </div>
                        <p>
                            This is a test section.
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
});

export default AccordionLayout;