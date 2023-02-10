import React, { useEffect, useState, useRef } from "react"
import Card from "./Card"
import axios from "axios"
import "../styling//Deck.css"

function Deck() {
  const [deck, setDeck] = useState(null)
  const [card, setCard] = useState([])
  const [autoDraw, setAutoDraw] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    async function getData() {
      let d = await axios.get(`http://deckofcardsapi.com/api/deck/new/shuffle/`)
      setDeck(d.data)
    }
    getData()
  }, [setDeck])

  useEffect(() => {
    async function getCard() {
      let { deck_id } = deck

      try {
        let curCard = await axios.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw/`)

        if (curCard.data.remaining === 0) {
          setAutoDraw(false)
          alert('The deck has ended')
        }

        const cardData = curCard.data.cards[0]

        setCard(c => [
          ...c,
          {
            id: cardData.code,
            name: cardData.suit + " " + card.value,
            image: cardData.image
          }
        ])
      } catch (err) {
        
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard()
      }, 50)
    }

    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [autoDraw, setAutoDraw, deck, card])

  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto)
  }

  const displayCards = card.map(c => (
    <Card key={c.id} name={c.name} img={c.image} />
  ))

  return (
    <div className="Deck">
        <button onClick={toggleAutoDraw}>Toggle Draw</button>
      <div>{displayCards}</div>
    </div>
  )
}

export default Deck
