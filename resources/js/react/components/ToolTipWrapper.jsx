import React from "react";

import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger
} from "@/components/HoverCard.jsx";

export const ToolTipWrapper = ({children, toolTip}) => {
    return (
        <HoverCard openDelay={0}>
            <HoverCardTrigger asChild={false}>
                {children}
            </HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent className="twr-max-w-[500px]">
                    <HoverCardArrow/>
                    {toolTip}
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>);
}
