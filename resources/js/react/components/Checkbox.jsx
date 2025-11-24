import React from "react";
import {Label} from "@/components/Label.jsx";

export const Checkbox = ({label, onChange, value, className}) => {
    return (<div className={"block min-h-6 " + className}>
        <label>
            <input
                   onChange={(event) => onChange(event.target.checked)}
                   checked={value}
                   className="rounded-1 w-4 h-4 mr-2 pt-[5px]"
                   type="checkbox"/>
            <Label htmlFor="checkbox-1" className="cursor-pointer pl-1">{label}</Label>
        </label>
    </div>);
}
