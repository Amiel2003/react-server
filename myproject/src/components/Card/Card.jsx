import React, { useState } from "react";
import {AnimateSharedLayout} from 'framer-motion'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './Card.css'

const Card = (props) => {

    const [expanded, setExpanded] = useState(false)

    return(
                <CompactCard param = {props}/>
    )
}

//CompactCard
function CompactCard ({param}){
    const Png = param.png;
    return(
        <div className="CompactCard"
        style={{
            background: param.color.backGround,
            boxShadow: param.color.boxShadow
        }}
        >
            <div className="radialBar">
                <CircularProgressbar
                value={param.barValue}
                text={`${param.barValue}%`}
                />
                <span>{param.title}</span>
            </div>
            <div className="detail">
                <Png/>
                {param.title !== 'Sales' && param.title !== 'Expenses' ? (
                        <span>{param.value}</span>
                    ) : (
                        <span>₱{param.value}</span>
                    )}
                <span>All Time</span>
            </div>
        </div>
    )
}


export default Card