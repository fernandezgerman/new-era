import React from "react";
import {
    Button,
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTime,
    TimelineTitle,
} from "flowbite-react";
import {HiArrowNarrowRight, HiCalendar} from "react-icons/hi";

const contentExample = [
    {
        title: 'Application UI code in Tailwind CSS',
        body: 'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.',
        date: 'February 2022',
        icon: HiCalendar,
        className: 'text-red-500'
    }
]

export function TimeLine({content}) {

    const renderContent = content ?? contentExample;

    return (
        <Timeline>
            {renderContent.map((item, index) => (
                <div className={item?.className ?? ''}>
                    <TimelineItem key={index}>
                        <TimelinePoint icon={item.icon ?? HiCalendar}/>
                        <TimelineContent>
                            <TimelineTime>{item.date ?? item.fechahora}</TimelineTime>
                            <TimelineTitle>{item.title ?? item.descripcion}</TimelineTitle>
                            <TimelineBody>
                                {item.body}
                            </TimelineBody>
                        </TimelineContent>
                    </TimelineItem>
                </div>
            ))}
        </Timeline>
    );
}
