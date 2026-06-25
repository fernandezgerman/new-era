import React, {useEffect, useState} from "react";
import {Label, LabelError, LabelSuccess} from "@/components/Label.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Input = ({
                   icon = null,
                   placeHolder = '',
                   ref = null,
                   value,
                   type = 'text',
                   setValue,
                   label,
                   className,
                   errorMessage,
                   validMessage,
                   inputClassName = '',
                   selectOnFocus = false,
                    maxCharacters = null,
                   onChange = () => {
                   },
                   onKeyDown = () => {
                   },
                   onKeyPress = () => {},
                   disabled = false,
               }) => {

    const processNumber = (number) => {
        const formateador = new Intl.NumberFormat('es-ES', {
            style: 'decimal', // 'currency' para monedas
            minimumFractionDigits: type === 'pesos' ? 2 : 0,
            maximumFractionDigits: type === 'pesos' ? 2 : 0
        });

        return formateador.format(number);
    }

    const processValue = (val) => {
        if(type === 'pesos' || type === 'cantidad')
        {
            return processNumber(val);
        }

        return val;
    }
    const getType = () =>
    {
        if(type === 'pesos') return 'text';
        if(type === 'cantidad') return 'text';
        return type;
    }

    const [displayValue, setDisplayValue] = useState(processValue(value));
    const [maskType, setMaskType] = useState(getType());

    let extraClass = icon === null ? '' : ' pl-[40px]!  ';
    extraClass = extraClass + (type === 'pesos' || type === 'cantidad' || maskType === 'number' ? ' text-right  ' : '');

    const _onChange = (e) => {
        const truncatedValue = maxCharacters && e.target.value ? e.target.value.slice(0, maxCharacters) : e.target.value;
        setDisplayValue(truncatedValue);

        if(type === 'number' || type === 'pesos' || type === 'cantidad')
        {
            setValue(parseFloat(e.target.value));
        }else{
            setValue(e.target.value);
        }

        onChange(e);
    }

    const onBlur = () => {
        if(type === 'pesos') {
            const processed = processValue(value);
            if( isNaN(value) )
            {
                setDisplayValue('·NUMERO INCORRECTO·');
            }else{
                setDisplayValue(processed);
            }
        }
    }

    const onFocus = (e) => {
        if(type === 'pesos') {
            setDisplayValue(value);
        }
        if(selectOnFocus) e.target.select();
    }

    const getSymbol = () =>
    {
        if(type === 'pesos') return '$';
        if(type === 'cantidad') return '#';
        if(maskType === 'number') return 'N';
        if(maskType === 'text') return 'T';
        if(maskType === 'email') return '@';
        if(maskType === 'password') return '*';

        return 'T';
    }

    const switchType = () =>
    {
        if(type === 'password'){
            setMaskType(maskType === 'password' ? 'text' : 'password')
        }
    }

    return (
        <div className={className + (disabled ? ' opacity-60 pointer-events-none ' : '')}>
            {label && <Label className="cursor-pointer pl-2  ">{label}</Label>}
            {icon && <FontAwesomeIcon className={' absolute ml-[12px] mt-[12px]'} icon={icon}/>}


            <div className={'flex w-full'}>
                <div onClick={switchType} className={' cursor-pointer w-10 text-center align-middle rounded-l-lg pt-2 text-md bg-gray-400 text-white '}>{getSymbol()}</div>
                <input
                    ref={ref}
                    type={maskType}
                    disabled={disabled}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeHolder}
                    onChange={_onChange}
                    onKeyPress={onKeyPress}
                    onKeyDown={onKeyDown}
                    maxLength={maxCharacters}
                    className={" h-9.5 focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-r-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none dark:ne-dark-input! dark:placeholder:text-white/80! dark:text-white/80!  " + inputClassName + extraClass }
                    value={displayValue}

                />
            </div>
            {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
            {validMessage && <LabelSuccess className={'ml-2'}>{validMessage}</LabelSuccess>}
        </div>
    );
}
export {Input};
