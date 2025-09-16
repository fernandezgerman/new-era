import * as React from "react";
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const HoverCard = HoverCardPrimitive.Root;

const HoverCardPortal = HoverCardPrimitive.Portal;

function cn(v1, v2, v3, v4) {
    return v1 + ' ' + v2 + ' ' + v3 + ' ' + v4;
}
const HoverCardTrigger = React.forwardRef(
    ({ className, ...props }, ref) => (
        <>
            <HoverCardPrimitive.Trigger
                ref={ref}
                className={cn(
                    'text-black hover:text-black',
                    className,
                )}
                {...props}
            />
        </>
    ),
);

const HoverCardArrow = React.forwardRef(
    ({ className, ...props }, ref) => (
        <>
            <HoverCardPrimitive.Arrow
                ref={ref}
                className={cn(
                    'bg-white',
                    className,
                )}
                {...props}
            />
        </>
    ),
);

const HoverCardContent = React.forwardRef(
    ({ className, ...props }, ref) => (
        <>
            <HoverCardPrimitive.Content
                ref={ref}
                className={cn(
                    'z-[1030] rounded-md bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    className,
                )}
                {...props}
            />
        </>
    ),
);

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

/*
const ToolTipWrapper = React.forwardRef(
    ({toolTip, trigger, icon}, ref) => (
        <HoverCard openDelay={0}>
            <HoverCardTrigger asChild={false}>
                {trigger}
                {icon && <FontAwesomeIcon
                    icon={icon}
                    className="h-4 w-4 mx-1"
                />}
            </HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent className={'max-w-[500px]'}>
                    <HoverCardArrow />
                    {toolTip}
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    )
);
*/
export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardPortal, HoverCardArrow };
