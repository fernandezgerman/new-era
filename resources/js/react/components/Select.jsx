import React, {useEffect, useLayoutEffect, useRef} from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import {Label} from "@/components/Label.jsx"; // Import default styles

// Generic Select component powered by Choices.js
// Props:
// - options: array of { value: string|number, label: string, selected?: boolean, disabled?: boolean }
// - value: string|number current selected value (controlled)
// - setValue: function(newValue) to update selection
// - placeholder: optional string to show as placeholder
// - allowSearch: boolean to enable search (default true)
// - allowRemove: boolean to show remove button for selected items (useful for multiple)
// - multiple: boolean to enable multiple selection (default false)
// - className: optional extra class names for the select element
const Select = ({
                    options = [],
                    value,
                    setValue,
                    placeholder = "",
                    allowSearch = true,
                    allowRemove = false,
                    multiple = false,
                    className = "",
                    id,
                    name,
                    isLoading = false,
                    onChange = () => {},
                    label
                }) => {
    const selectRef = useRef(null);
    const choicesRef = useRef(null);
    const localClassName = className + " " + (isLoading ? "opacity-50 !color-gray cursor-not-allowed" : "");

    // Initialize Choices.js synchronously to avoid DOM teardown race conditions
    useLayoutEffect(() => {
        if (!selectRef.current) return;

        // If React StrictMode remounts, ensure previous instance is gone
        if (choicesRef.current) {
            try { choicesRef.current.destroy(); } catch {}
            choicesRef.current = null;
        }

        choicesRef.current = new Choices(selectRef.current, {
            removeItemButton: allowRemove,
            searchEnabled: allowSearch,
            placeholder: !!placeholder,
            itemSelectText: '',
            placeholderValue: placeholder,
            shouldSort: false,
        });

        return () => {
            if (choicesRef.current) {
                try { choicesRef.current.destroy(); } catch {}
                choicesRef.current = null;
            }
        };
    }, []);

    // Sync options when they change
    useEffect(() => {
        if (!choicesRef.current) return;
        const choices = options.map((opt) => ({
            value: String(opt.value),
            label: opt.label,
            disabled: !!opt.disabled,
            selected: value !== undefined && value !== null ? String(value) === String(opt.value) : !!opt.selected,
        }));
        choicesRef.current.clearStore();
        choicesRef.current.setChoices(choices, "value", "label", true);
    }, [options]);

    // Sync selected value
    useEffect(() => {
        if (!choicesRef.current) return;
        const stringVal = value !== undefined && value !== null ? String(value) : "";
        const current = choicesRef.current.getValue(true);
        if (String(current) !== stringVal) {
            choicesRef.current.setChoiceByValue(stringVal);
        }
    }, [value]);

    // Handle change events to lift state up
    useEffect(() => {
        if (!selectRef.current || !setValue) return;
        const handler = (e) => {
            if (multiple) {
                const values = Array.from(e.target.selectedOptions).map((o) => o.value);
                setValue(values);
            } else {
                setValue(e.detail?.value ?? e.target.value);
            }
        };
        const el = selectRef.current;
        el.addEventListener("change", handler);
        return () => el.removeEventListener("change", handler);
    }, [setValue, multiple]);

    return (
        <>
            {label && <Label className="cursor-pointer pl-2 ">{label}</Label>}

            <select
                id={id}
                name={name}
                ref={selectRef}
                onChange={onChange}
                disabled={isLoading}
                multiple={multiple}
                className={`focus:shadow-soft-primary-outline dark:!ne-dark-input dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none ${localClassName}`}
            />
        </>
    );
};

export {Select};
