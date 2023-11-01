import React, { useEffect, useState, useRef } from "react"
import Card from "./Card"
import axios from "axios"

const BASE_URL = "http://deckofcardsapi.com/api/deck"


function Deck() {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])
    const [autoDraw, setAutoDraw] = useState(false)
    const timer = useRef(null)

    useEffect( () => {
        async function fetchNewDeck() {
            const newDeck = await axios.get(`${BASE_URL}/new/shuffle/`)
            setDeck(newDeck.data)
        }

        fetchNewDeck()

    }, [setDeck])

    useEffect(() => {

        async function getCard() {
            try {

                const response = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`)

                if (response.data.remaining === 0) {
                    setAutoDraw(false)
                    throw new Error("no cards remaining!")
                }

                const card = response.data.cards[0]

                setDrawn(d => [
                                ...d,
                                {
                                    id: card.code,
                                    name: card.suit + " " + card.value,
                                    image: card.image
                                }
                        ])
            } catch (err) { alert(err) }

        }

        if (autoDraw) {
            timer.now = setInterval(async () => {
                await getCard()
            }, 1000)
        }

        return () => {
            clearInterval(timer.now)
            timer.now = null
        }

    }, [autoDraw, setAutoDraw, deck])

    
    const cards = drawn.map( (card) => (
        <Card key={card.id} name={card.name} image={card.image} />
    ))

    const toggleAutoDraw = () => {
        setAutoDraw( (auto) => !auto)
    }

    return (
        <div className="Deck">
            {
                    deck ? (
                        <button  onClick={toggleAutoDraw}>
                        {autoDraw ? "STOP" : "KEEP"} Draw
                        </button>
                    ) : null
            }
            <div>{cards}</div>
        </div>
    )
}

export default Deck
