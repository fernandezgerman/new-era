import React from "react";
import {Alertas} from "@/widgets/menu/Alertas.jsx";
import {UserAndBreadcrumb} from "@/widgets/menu/UserAndBreadcrum.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {isMobile} from "react-device-detect";

export const Header = ({breadCrumbFirst, breadCrumbSecond, onMenuSelected}) => {



    const webHeader = (
            <div className="relative flex flex-col flex-auto min-w-0 p-4 mt-[5px] overflow-hidden break-words border-0 ">
                <div className="flex flex-wrap -mx-3">
                    <ErrorBoundary>
                        <UserAndBreadcrumb breadCrumbFirst={breadCrumbFirst} breadCrumbSecond={breadCrumbSecond}
                                           onMenuSelected={onMenuSelected}/>
                        <Alertas onMenuSelected={onMenuSelected}/>
                    </ErrorBoundary>
                </div>
            </div>
    )

    return isMobile ? '' : webHeader;
}

