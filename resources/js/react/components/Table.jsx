import React from "react";
import {DivCenterContentHyV} from "@/components/Containers/DivCenterContentHyV.jsx";
import useSystemTheme from "@/utils/useSystemTheme.jsx";

const CreateRow = ({row, className, index, destacarColumnasPares, darkMode}) => {
    return <tr className={className}>
        {row.map((cell) => (
            <td key={cell?.key ?? cell.id}
                colSpan={cell.colSpan ?? 1}
                rowSpan={cell.rowSpan ?? undefined}
                className={
                    " font-normal leading-normal text-sm " +
                    (destacarColumnasPares && (index % 2 !== 0) ? (darkMode ? ' bg-gray-800 ' : ' bg-gray-200 ') : '') +
                    (cell?.onClick ? '  cursor-pointer' : '') +
                    (cell.className ?? '')}>
                {cell.onClick && <button onClick={cell?.onClick}
                                         className={' w-full text-left'}>{cell.content}</button>}
                {!(cell?.onClick) && <>{cell.content}</>}
            </td>
        ))}
    </tr>
}

export const Table = ({
                          header = [],
                          className = '',
                          data, footer = <></>,
                          top = <></>,
                          emptyText = null,
                          destacarColumnasPares = false,
                          containerClassName = '',
                          isLoading
                      }) => {

    const darkMode = useSystemTheme();
    const isTableEmpty = !(data?.length > 0);

    return <div className={containerClassName}>
        {top}
        {!isTableEmpty &&
            <table border={0} cellPadding={0} cellSpacing={0} className={"table w-full flex " + className + (isLoading ? ' opacity-50 ' : '')} datatable
                   id="datatable-basic">
                <thead>
                <tr>
                    {header.map((head) => (
                        <th
                            key={head.key ?? head.name}
                            onClick={head.onClick}
                            className={
                                "font-bold uppercase text-slate-500 text-xxs dark:text-slate-500 "
                                + (head.onClick ? ' cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-300 ' : '')
                                + (head.className ?? '')
                            }
                        >
                            {head.content ?? head.name}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <CreateRow
                        className={row.className}
                        row={row?.content ?? row}
                        key={row?.key ?? row?.id ?? index}
                        index={index}
                        destacarColumnasPares={destacarColumnasPares}
                        darkMode={darkMode}
                    />
                ))}
                </tbody>
            </table>
        }

        {isTableEmpty && <DivCenterContentHyV
            className={'w-full p-6 h-10! text-slate-600 dark:text-slate-400'}>{isLoading ? 'Cargando...' : (emptyText ?? 'No se encontro informacion relacionada.')}</DivCenterContentHyV>}
        {footer}
    </div>;
}
