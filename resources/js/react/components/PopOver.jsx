import React from "react";
import { Button, Popover } from "flowbite-react";

export function PopOver({title, content, children}) {
    return (
        <Popover
            aria-labelledby="default-popover"
            content={
                <div className="w-64 text-sm ne-body  dark:ne-dark-body  dark:text-slate-100 ">
                    <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-600 bg-pink-700">
                        <span id="default-popover" className="font-semibold text-white">
                            {title}
                        </span>
                    </div>
                    <div className="px-3 py-2">
                        <p>{content}</p>
                    </div>
                </div>
            }
        >
            <button>{children}</button>
        </Popover>
    );
}
