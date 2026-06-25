import moment from "moment";

const pluralize = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;

const joinDurationParts = (parts) => parts.filter((part) => part != null).join(', ');

export const processSinceDate = (date, showDecimalsAsTimeInterval = false) => {
    if (!date) {
        return '';
    }

    const then = moment(date);
    if (!then.isValid() || !then.isBefore(moment())) {
        return '';
    }

    const now = moment();
    const totalSeconds = now.diff(then, 'seconds');

    if (totalSeconds < 60) {
        return pluralize(totalSeconds, 'segundo', 'segundos');
    }

    const totalMinutes = now.diff(then, 'minutes');
    if (totalMinutes < 60) {
        const seconds = totalSeconds - (totalMinutes * 60);
        return joinDurationParts([
            pluralize(totalMinutes, 'minuto', 'minutos'),
            seconds > 0 && showDecimalsAsTimeInterval ? pluralize(seconds, 'segundo', 'segundos') : null,
        ]);
    }

    const totalHours = now.diff(then, 'hours');
    if (totalHours < 24) {
        const minutes = totalMinutes - (totalHours * 60);
        return joinDurationParts([
            pluralize(totalHours, 'hora', 'horas'),
            minutes > 0 && showDecimalsAsTimeInterval ? pluralize(minutes, 'minuto', 'minutos') : null,
        ]);
    }

    const totalMonths = now.diff(then, 'months');
    if (totalMonths < 1) {
        const days = now.diff(then, 'days');
        const hours = now.diff(then.clone().add(days, 'days'), 'hours');
        return joinDurationParts([
            pluralize(days, 'día', 'días'),
            hours > 0 && showDecimalsAsTimeInterval ? pluralize(hours, 'hora', 'horas') : null,
        ]);
    }

    const totalYears = now.diff(then, 'years');
    if (totalYears < 1) {
        const days = now.diff(then.clone().add(totalMonths, 'months'), 'days');
        return joinDurationParts([
            pluralize(totalMonths, 'mes', 'meses'),
            days > 0 && showDecimalsAsTimeInterval ? pluralize(days, 'día', 'días') : null,
        ]);
    }

    const months = now.diff(then.clone().add(totalYears, 'years'), 'months');
    return joinDurationParts([
        pluralize(totalYears, 'año', 'años'),
        months > 0  && showDecimalsAsTimeInterval ? pluralize(months, 'mes', 'meses') : null,
    ]);
};

export const processDate = (momentDate, onlyDate = false, shortForm = true) => {
    if(!momentDate){
        return '';
    }

    if(!shortForm)
    {
        return momentDate.format(onlyDate ? "DD/MM/YYYY" : "DD/MM/YYYY HH:mm");
    }



    const today = moment();
    if (momentDate.isSame(today, 'day')) {
        return momentDate.format("HH:mm");
    }

    if (momentDate.isSame(today, 'year')) {
        return momentDate.format(onlyDate ? "DD/MM" : "DD/MM HH:mm");
    }

    return momentDate.format("DD/MM/YYYY");
}
