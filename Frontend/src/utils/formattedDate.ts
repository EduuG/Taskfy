import {format, FormatOptions, isSameDay, isSameWeek} from "date-fns";
import {ptBR} from "date-fns/locale";

const formattedDate = (date: Date): {date: string; time: string} => {
    const currentDate = new Date();
    let taskDate = new Date(date);

    if (!date.toString().endsWith("Z")) {
        taskDate = new Date(taskDate.toString() + "Z");
    }

    const formatOptions: FormatOptions = {
        locale: ptBR
    }

    const time = format(taskDate, "HH:mm", formatOptions);

    if (isSameDay(taskDate, currentDate)) {
        return { date: "Hoje", time };
    }

    if (isSameWeek(taskDate, currentDate, formatOptions)) {
        const dayOfWeek = format(taskDate, 'EEEEEEE', formatOptions);
        return {date: dayOfWeek, time}
    }

    return {date: format(new Date(taskDate), 'dd/MM/yyyy', formatOptions), time};
}

export default formattedDate;