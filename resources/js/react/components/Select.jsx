import React, {useCallback, useEffect, useLayoutEffect, useRef} from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import {Label, LabelError, LabelSuccess} from "@/components/Label.jsx"; // Import default styles

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
// - searchResultLimit: max choices shown while searching (Choices.js default is 4). Use -1 for no cap.
// - keepSearchTextOnMultiSelect: when multiple=true, keep the search box text after picking an option.
// - onSearchQueryChange: called with the current search string on each keystroke (empty string when cleared).
// - showClearAllMultiple: when multiple=true, show a control to clear all selections (default true).
// - clearAllMultipleLabel: label for that control.
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
                    disabled = false,
                    isLoading = false,
                    onChange = () => {},
                    label,
                    errorMessage,
                    validMessage,
                    searchResultLimit = 250,
                    keepSearchTextOnMultiSelect = false,
                    onSearchQueryChange,
                    showClearAllMultiple = true,
                    clearAllMultipleLabel = 'Deseleccionar todo',
                }) => {
    const selectRef = useRef(null);
    const choicesRef = useRef(null);
    const onSearchQueryChangeRef = useRef(onSearchQueryChange);
    onSearchQueryChangeRef.current = onSearchQueryChange;
    const keepSearchTextOnMultiSelectRef = useRef(keepSearchTextOnMultiSelect);
    keepSearchTextOnMultiSelectRef.current = keepSearchTextOnMultiSelect;
    const multipleRef = useRef(multiple);
    multipleRef.current = multiple;
    const localClassName = className + " " + (isLoading ? "opacity-50 !color-gray cursor-not-allowed" : "");

    const hasMultiSelection =
        multiple
        && Array.isArray(value)
        && value.length > 0;

    const handleClearAllMulti = useCallback(() => {
        if (!multiple || !setValue) {
            return;
        }
        setValue([]);
        onSearchQueryChange?.('');
        queueMicrotask(() => {
            try {
                choicesRef.current?.clearInput?.();
            } catch {
                /* noop */
            }
        });
    }, [multiple, onSearchQueryChange, setValue]);

    // Initialize Choices.js synchronously to avoid DOM teardown race conditions
    useLayoutEffect(() => {
        if (!selectRef.current) return;

        // If React StrictMode remounts, ensure previous instance is gone
        if (choicesRef.current) {
            try { choicesRef.current.destroy(); } catch {}
            choicesRef.current = null;
        }

        let detachNeListeners = null;

        choicesRef.current = new Choices(selectRef.current, {
            removeItemButton: allowRemove,
            searchEnabled: allowSearch,
            searchResultLimit,
            placeholder: !multiple && !!placeholder,
            itemSelectText: '',
            placeholderValue: placeholder,
            shouldSort: false,
            removeItems: true,
            classNames: {
                containerOuter: ['choices', 'relative', 'min-w-[200px]', multiple ? 'bg-gray-100!' : 'bg-transparent'],
             /*   containerInner: ['choices__inner',  'border', 'border-gray-300', 'rounded-lg', 'p-2'],
                input: ['choices__input', 'bg-transparent!', 'outline-none'],
                list: ['choices__list'],
                listSingle: ['choices__list--single'],
                listDropdown: ['choices__list--dropdown', 'bg-white', 'border', 'border-gray-200', 'shadow-lg', 'rounded-md', 'mt-1', 'z-50'],
                item: ['choices__item', 'p-2'],
                choice: ['choices__item--choice', 'p-2', 'hover:bg-blue-50', 'cursor-pointer', 'transition-colors'],
                choiceSelectable: ['choices__item--selectable'],
                choiceDisabled: ['choices__item--disabled', 'opacity-50', 'cursor-not-allowed' ],
                placeholder: ['choices__placeholder', 'bg-transparent', 'p-2'],*/
            },
            callbackOnInit() {
                const choices = this;
                const inputEl = choices.input.element;
                const selectEl = choices.passedElement.element;

                const onInput = () => {
                    const cb = onSearchQueryChangeRef.current;
                    if (cb) {
                        cb(inputEl.value ?? '');
                    }
                };

                const onAddItem = () => {
                    if (!keepSearchTextOnMultiSelectRef.current || !multipleRef.current) {
                        return;
                    }
                    const saved = inputEl.value ?? '';
                    const floor = choices.config?.searchFloor ?? 1;
                    if (!saved || saved.length < floor) {
                        return;
                    }
                    queueMicrotask(() => {
                        try {
                            if (choicesRef.current !== choices) {
                                return;
                            }
                            inputEl.value = saved;
                            inputEl.dispatchEvent(new InputEvent('input', {bubbles: true}));
                        } catch {
                            /* noop */
                        }
                    });
                };

                inputEl.addEventListener('input', onInput);
                selectEl.addEventListener('addItem', onAddItem);
                detachNeListeners = () => {
                    inputEl.removeEventListener('input', onInput);
                    selectEl.removeEventListener('addItem', onAddItem);
                };
            },
        });

        return () => {
            detachNeListeners?.();
            detachNeListeners = null;
            if (choicesRef.current) {
                try { choicesRef.current.destroy(); } catch {}
                choicesRef.current = null;
            }
        };
    }, [allowRemove, allowSearch, multiple, placeholder, searchResultLimit]);

    // Sync options when they change
    useEffect(() => {
        if (!choicesRef.current) return;
        const choices = options.map((opt) => {
            let selected = !!opt.selected;
            if (value !== undefined && value !== null) {
                if (multiple && Array.isArray(value)) {
                    selected = value.map(String).includes(String(opt.value));
                } else {
                    selected = String(value) === String(opt.value);
                }
            }
            return {
                value: String(opt.value),
                label: opt.label,
                disabled: !!opt.disabled,
                selected: selected,
            };
        });
        choicesRef.current.clearStore();
        choicesRef.current.setChoices(choices, "value", "label", true);
    }, [options]);

    // Sync selected value
    useEffect(() => {
        if (!choicesRef.current) return;
        if (multiple) {
            const currentValues = choicesRef.current.getValue(true);
            const nextValues = Array.isArray(value) ? value.map(String) : [];
            if (JSON.stringify(currentValues.sort()) !== JSON.stringify(nextValues.sort())) {
                choicesRef.current.removeActiveItems();
                choicesRef.current.setChoiceByValue(nextValues);
            }
        } else {
            const stringVal = value !== undefined && value !== null ? String(value) : "";
            const current = choicesRef.current.getValue(true);
            if (String(current) !== stringVal) {
                choicesRef.current.setChoiceByValue(stringVal);
            }
        }
    }, [value, multiple]);

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
                disabled={disabled}
                multiple={multiple}
                className={`focus:shadow-soft-primary-outline dark:!ne-dark-input dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none ${localClassName}`}
            />
            {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
            {validMessage && <LabelSuccess className={'ml-2'}>{validMessage}</LabelSuccess>}
            {multiple && setValue && showClearAllMultiple && !disabled && !isLoading && hasMultiSelection && (
                <div className={'mt-2 pl-2'}>
                    <button
                        type={'button'}
                        className={
                            'cursor-pointer border-0 bg-transparent p-0 text-left text-sm underline '
                            + 'text-slate-600 decoration-slate-400 hover:text-slate-900 '
                            + 'dark:text-slate-400 dark:decoration-slate-500 dark:hover:text-slate-200'
                        }
                        onClick={handleClearAllMulti}
                    >
                        {clearAllMultipleLabel}
                    </button>
                </div>
            )}
        </>
    );
};

export {Select};
