import React from "react";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons/faChevronDown";
import {Alertas} from "@/widgets/menu/Alertas.jsx";
import {UserAndBreadcrumb} from "@/widgets/menu/UserAndBreadcrum.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";

export const Header = ({breadCrumbFirst, breadCrumbSecond, onMenuSelected}) => {

    return (<div
        className="relative flex flex-col flex-auto min-w-0 p-4 mt-[25px] overflow-hidden break-words border-0 ">
        <div className="flex flex-wrap -mx-3">
            <ErrorBoundary>
                <UserAndBreadcrumb breadCrumbFirst={breadCrumbFirst} breadCrumbSecond={breadCrumbSecond}
                                   onMenuSelected={onMenuSelected}/>
                <Alertas onMenuSelected={onMenuSelected}/>
            </ErrorBoundary>
        </div>
    </div>)
}

