import React from "react";
import {Label, LabelError, LabelSuccess} from "@/components/Label.jsx";

export const Checkbox = ({label, onChange, value, className, left = false, errorMessage, validMessage}) => {
    return (<div className={"block min-h-6 " + className}>
        <label>
            {left && (<Label htmlFor="checkbox-1" className="cursor-pointer pr-4">{label}</Label>)}
            <input
                   onChange={(event) => onChange(event.target.checked)}
                   checked={value}
                   className={"rounded-1 w-5 h-5 pt-[5px]" + (left ? ' ml-2 ' : ' mr-2 ')}
                   type="checkbox"/>
            {!left && (<Label htmlFor="checkbox-1" className="cursor-pointer pl-1">{label}</Label>)}
            {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
            {validMessage && <LabelSuccess className={'ml-2'}>{validMessage}</LabelSuccess>}
        </label>
    </div>);
}
