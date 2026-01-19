import React from "react";
import {get} from "lodash";
import {DivCenterContentHyV} from "@/components/Containers/DivCenterContentHyV.jsx";
import useSystemTheme from "@/utils/useSystemTheme.jsx";

export const Table = ({
                          header = [],
                          className = '',
                          data, footer = <></>,
                          top = <></>,
                          emptyText = null,
                          destacarColumnasPares = false,
                          containerClassName = ''
                      }) => {

    const darkMode = useSystemTheme();
    const isTableEmpty = !(data?.length > 0);
    return <div className={containerClassName}>
        {top}
        {!isTableEmpty &&
            <table border={0} cellPadding={0} cellSpacing={0} className={"table w-full flex " + className} datatable
                   id="datatable-basic">
                <thead>
                <tr>
                    {header.map((head) => (
                        <th key={head.name}
                            className={"font-bold uppercase text-slate-400 text-xxs opacity-70 " + head.className ?? ''}>{head.name}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={row?.key ?? row?.id}>
                        {row.map((cell) => (
                            <td key={cell?.key ?? cell.id ?? cell?.content}
                                colSpan={cell.colSpan ?? 1}
                                className={
                                    " font-normal leading-normal text-sm " +
                                    (destacarColumnasPares && (index % 2 === 0) ? (darkMode ? ' bg-gray-800 ' : ' bg-gray-200 ') : '') +
                                    (cell?.onClick ? '  cursor-pointer' : '') +
                                    (cell.className ?? '')}>
                                {cell.onClick && <button onClick={cell?.onClick}
                                                         className={' w-full text-left'}>{cell.content}</button>}
                                {!(cell?.onClick) && <>{cell.content}</>}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        }

        {isTableEmpty && <DivCenterContentHyV
            className={'w-full p-6 h-10!'}>{emptyText ?? 'No se encontro informacion relacionada.'}</DivCenterContentHyV>}
        {footer}
    </div>;
}
