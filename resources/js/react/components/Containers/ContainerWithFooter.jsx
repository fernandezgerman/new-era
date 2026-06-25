
import ErrorBoundary from "@/components/ErrorBoundary.jsx";

import {AlternativeCard} from "@/components/Card.jsx";
import React from "react";


export const ContainerWithFooter = ({footer, children, scrolleableClassName}) => {

    return (<AlternativeCard className={'overflow-hidden p-0! mt-3! '}>
        <div className={'flex max-h-[calc(100vh-14rem)] min-h-[20rem] flex-col ' + scrolleableClassName}>
            <div className={'relative flex-1 overflow-y-auto p-4 max-h-[calc(100vh-18rem)] ' }>
                {children}
            </div>
        </div>

        <ErrorBoundary>
            <div
                className={
                    'shrink-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm '
                    + 'dark:border-slate-700 dark:bg-transparent'
                }
            >
                <div className={'flex flex-wrap items-right justify-between gap-3'}>
                    {footer}
                </div>
            </div>
        </ErrorBoundary>

    </AlternativeCard>);
}
