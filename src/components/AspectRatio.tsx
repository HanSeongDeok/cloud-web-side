import { memo } from "react"
import AccordionDemo from "./Acodian";
const AspectRatioLayout = memo(() => {
    return (
      <div className="w-screen max-w-[1200px] mx-auto px-1">
          <div className="relative z-10 p-3">
            <AccordionDemo />
          </div>
        </div>
    );
  });
  

export default AspectRatioLayout;
