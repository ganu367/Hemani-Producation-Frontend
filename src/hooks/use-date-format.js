
export default function useDateFormat() {
    const getBackDate = (date) => {
        if (date) {
            const today = new Date(date);
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();
    
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
    
            return (yyyy + '-' + mm + '-' + dd + " 00:00:00");
        }
    }
    const dateConverter = (datetime) => {
        if (datetime) {
            const today = new Date(datetime);
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();
    
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
    
            return (dd + '/' + mm + '/' + yyyy);
        }
        return "N/A";
    }
    const timeConverter = (datetime) => {
        const today = new Date(datetime);
        let hh = today.getHours();
        let mm = today.getMinutes();
        let ampm = hh >= 12 ? 'pm' : 'am';
        hh = hh % 12;
        hh = hh ? hh : 12;

        if (hh < 10) hh = '0' + hh;
        if (mm < 10) mm = '0' + mm;

        return (hh + ':' + mm + ampm);
    }
    const gridDateTime = (datetime) => {
        if(datetime)
            return dateConverter(datetime) + " " + timeConverter(datetime);
    }
    const defaultDate = () => {
        const datetime = getNow();
        if (datetime) {
            const today = new Date(datetime);
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();
    
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
    
            return (yyyy + '-' + mm + '-' + dd);
        }
        return "N/A";
    }
    const defaultTime = () => {
        const datetime = new Date();
        let hh = datetime.getHours();
        let mm = datetime.getMinutes();
        let ss = datetime.getSeconds();
        if (hh < 10) hh = '0' + hh;
        if (mm < 10) mm = '0' + mm;
        if (ss < 10) ss = '0' + ss;
        
        return (hh + ':' + mm + ':' + ss);
    }
    const timeFormatter = (time) => {
        let hh = time.substring(0,2);
        let mm = time.substring(3,6);
        let ampm = hh >= 12 ? 'pm' : 'am';
        hh = hh % 12;
        if (hh < 10) hh = '0' + hh;

        return (hh + ':' + mm + ampm);
    }
    const dateTimeFormatter = (date,time) => {
        return (new Date(`${date} ${time}`));
    }
    const getNow = () => {
        return (new Date(new Date().toLocaleString() + " UTC"));
    }
    const getDate = (date) => {
        return (new Date(new Date(date).toLocaleString().substring(0,10) + " UTC"));
    }
    const getDateTime = (date, time) => {
        // console.log(new Date(new Date(date).toLocaleString().substring(0,10) + time + " UTC"));
        console.log("date: ",new Date(date).toLocaleString().substring(0,10));
        // console.log("time: ",time);
        // console.log("new Date: ",new Date());
        return (new Date(new Date(date).toLocaleString().substring(0,10) + " " + time + " UTC"));
    }

    return {dateConverter,timeConverter,timeFormatter,dateTimeFormatter,getNow,getDate,getDateTime,defaultDate,defaultTime,gridDateTime,getBackDate};
}
