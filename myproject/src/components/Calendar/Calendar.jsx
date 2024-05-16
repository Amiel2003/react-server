import React,{useState} from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Calendar.css'

const ReactCalendar = () => {
    const [date,setDate] =  useState(new Date())

    const onChange = date => {
        setDate(date)
    }
    return(
        <div>
            <Calendar onChange={onChange} value={date} className="Calendar"/>
            <span className='dateString'>{date.toString()}</span>
        </div>
    )
}

export default ReactCalendar;
