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

const AccordionLayout = memo(() => {
    return (
        <div className="accordionContainer">
            <Accordion
                type="single"
                collapsible
                style={{ backgroundColor: 'oklch(0.145 0 0)' }}
                className="accordion"
                defaultValue="item-1"
            >
                <AccordionItem value="item-1" className="accordionItem">
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