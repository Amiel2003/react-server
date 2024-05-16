import React, { useEffect, useState } from "react";
import './Updates.css'
import { UpdatesData } from "../Data/Data";
import axios from "axios";

const Updates = () => {
    const [USD, setUSD] = useState('')
    const [SGD, setSGD] = useState('')
    const [CNY, setCNY] = useState('')
    const [RUB, setRUB] = useState('')

    useEffect(() => {

        const usdToPhp = {
            method: 'GET',
            url: process.env.REACT_APP_CURRENCY_URL,
            params: {
                from: 'USD',
                to: 'PHP',
                q: '1.0'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_CURRENCY_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_CURRENCY_HOST
            }
        };

        const sgdToPhp = {
            method: 'GET',
            url: process.env.REACT_APP_CURRENCY_URL,
            params: {
                from: 'SGD',
                to: 'PHP',
                q: '1.0'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_CURRENCY_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_CURRENCY_HOST
            }
        };

        const cnyToPhp = {
            method: 'GET',
            url: process.env.REACT_APP_CURRENCY_URL,
            params: {
                from: 'CNY',
                to: 'PHP',
                q: '1.0'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_CURRENCY_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_CURRENCY_HOST
            }
        };

        const rubToPhp = {
            method: 'GET',
            url: process.env.REACT_APP_CURRENCY_URL,
            params: {
                from: 'RUB',
                to: 'PHP',
                q: '1.0'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_CURRENCY_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_CURRENCY_HOST
            }
        };

        try {
            axios.request(usdToPhp)
                .then((res) => {
                    setUSD(res.data)
                })
                .catch((error) => { console.error('Error getting exchange', error) });
            axios.request(sgdToPhp)
                .then((res) => {
                    setSGD(res.data)
                })
                .catch((error) => { console.error('Error getting exchange', error) });
            axios.request(cnyToPhp)
                .then((res) => {
                    setCNY(res.data)
                })
                .catch((error) => { console.error('Error getting exchange', error) });
            axios.request(rubToPhp)
                .then((res) => {
                    setRUB(res.data)
                })
                .catch((error) => { console.error('Error getting exchange', error) });
        } catch (error) {
            console.error(error);
        }

    }, [])

    return (
        <div className="Updates">
            <h5>CURRENCY EXCHANGE</h5>
            <hr className="line" />

            <div className="update">
                <div className="noti">
                    <div className="USD">
                        <h4>USD <img src="/images/america.png" alt="america.png" className="flags" /></h4>
                        <h4>=</h4>
                        <h4>₱{USD} <img src="/images/philippines.png" alt="philippine.png" className="flags" /></h4>
                    </div>
                    <div className="USD">
                        <h4>SGD <img src="/images/singapore.png" alt="america.png" className="flags" /></h4>
                        <h4>=</h4>
                        <h4>₱{SGD.toString().substring(0, 6)} <img src="/images/philippines.png" alt="philippine.png" className="flags" /></h4>
                    </div>
                    <div className="USD">
                        <h4>CNY <img src="/images/china.png" alt="america.png" className="flags" /></h4>
                        <h4>=</h4>
                        <h4>₱{CNY.toString().substring(0, 6)} <img src="/images/philippines.png" alt="philippine.png" className="flags" /></h4>
                    </div>
                    <div className="USD">
                        <h4>RUB <img src="/images/russia.png" alt="america.png" className="flags" /></h4>
                        <h4>=</h4>
                        <h4>₱{RUB.toString().substring(0, 6)} <img src="/images/philippines.png" alt="philippine.png" className="flags" /></h4>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Updates