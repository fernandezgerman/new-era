import React, {useEffect, useRef} from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css"; // Import default styles

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
                }) => {
    const selectRef = useRef(null);
    const choicesRef = useRef(null);

    // Initialize Choices.js
    useEffect(() => {
        if (!selectRef.current) return;

        choicesRef.current = new Choices(selectRef.current, {
            removeItemButton: allowRemove,
            searchEnabled: allowSearch,
            placeholder: !!placeholder,
            placeholderValue: placeholder,
            shouldSort: false,
        });

        return () => {
            if (choicesRef.current) {
                choicesRef.current.destroy();
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
        <select
            id={id}
            name={name}
            ref={selectRef}
            multiple={multiple}
            className={`focus:shadow-soft-primary-outline dark:!ne-dark-input dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none ${className}`}
        >
            {/* Render plain options initially for non-JS and initial hydration; Choices.js will take over */}
            {! isLoading && placeholder && !multiple && (
                <option value="" disabled={true} selected={value === undefined || value === null || value === ""}>
                    {placeholder}
                </option>
            )}
            {! isLoading && options.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)} disabled={!!opt.disabled} selected={
                    value !== undefined && value !== null
                        ? String(value) === String(opt.value)
                        : !!opt.selected
                }>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};

export {Select};
