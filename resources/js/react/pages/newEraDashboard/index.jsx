import React, {useEffect, useState} from 'react';
import {ArreglosDeStockChartCard} from "@/widgets/Dashboard/ArreglosStockChart/index.jsx";
export const NewEraDashboard = ({}) => {
    return <div className={'grid grid-cols-6 gap-1 mr-3'}>
        <ArreglosDeStockChartCard />
    </div>
}
