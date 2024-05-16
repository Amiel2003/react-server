import axios from "axios"
import { useEffect, useState } from "react";
import BarLoader from "react-spinners/BarLoader";

const RandomQuote = () => {
    const [quote, setQuote] = useState('')
    const [loading, setLoading] = useState(true)
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    async function loadQuotes() {
        try {
            const res = await axios.get('https://type.fit/api/quotes');
            const quotes = res.data;
            const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setQuote(selectedQuote)
            setLoading(false);
        } catch (error) {
            console.log('Error fetching quotes:', error);
        }
    }

    useEffect(() => {
        loadQuotes()
    }, [])

    return (
        <div className="card-body text-center">
            {loading ? (
                // Display the BarLoader while loading
                <BarLoader
                    cssOverride={override}
                    color="purple" />
            ) : quote ? (
                // Display the quote if quote is not null
                <div>
                    <h6>Message of the day</h6>
                    <h2>{quote.text}</h2>
                    <h8>{quote.author}</h8>
                </div>
            ) : (
                // Handle the case when quote is null
                <p>No quote available</p>
            )}
        </div>
    )
}

export default RandomQuote