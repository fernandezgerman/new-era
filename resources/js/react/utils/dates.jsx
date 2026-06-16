import moment from "moment";

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
