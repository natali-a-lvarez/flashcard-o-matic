import React, { useState, useEffect } from "react";
import {
  useHistory,
  useParams,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck } from "../utils/api";

function Study() {
  const history = useHistory();
  const { deckId } = useParams();
  const [deck, setDeck] = useState({});
  const [cards, setCards] = useState([]);
  const [front, setFront] = useState(true);
  const [cardNumber, setCardNumber] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const abortController = new AbortController();
      try {
        const deckResponse = await readDeck(deckId, abortController.signal);
        setDeck(deckResponse);
        setCards(deckResponse.cards);
      } catch (error) {
        console.error("Something went wrong", error);
      }
      return () => {
        abortController.abort();
      };
    }
    fetchData();
  }, []);

  function nextCard(index, total) {
    if (index < total) {
      setCardNumber(cardNumber + 1);
      setFront(true);
    } else {
      if (
        window.confirm(
          `Restart cards? Click 'cancel' to return to the home page`
        )
      ) {
        setCardNumber(1);
        setFront(true);
      } else {
        history.push("/");
      }
    }
  }

  function flipHandler() {
    if (front) {
      setFront(false);
    } else {
      setFront(true);
    }
  }

  function showNextButton(cards, index) {
    if (front) {
      return null;
    } else {
      return (
        <button
          onClick={() => nextCard(index + 1, cards.length)}
          className="btn btn-primary mx-1"
        >
          Next
        </button>
      );
    }
  }

  function notEnoughCards() {
    return (
      <div>
        <h4>Not Enough Cards.</h4>
        <p>
          You need at least 3 cards to study. There are {cards.length} cards in
          this deck.
        </p>
        <Link
          to={`/decks/${deck.id}/cards/new`}
          className="btn btn-primary mx-1"
        >
          + Add Cards
        </Link>
      </div>
    );
  }

  function enoughCards() {
    return (
      <div className="card">
        {cards.map((card, index) => {
          if (index === cardNumber - 1) {
            return (
              <div className="card-body" key={card.id}>
                <div className="card-title">
                  {`Card ${index + 1} of ${cards.length}`}
                </div>
                <div className="card-text">
                  {front ? card.front : card.back}
                </div>
                <button
                  onClick={flipHandler}
                  className="btn btn-secondary mx-1"
                >
                  Flip
                </button>
                {showNextButton(cards, index)}
              </div>
            );
          }
        })}
      </div>
    );
  }

  return (
    <>
      <ol className="breadcrumb">
        <Link className="breadcrumb-item" to="/">
          Home
        </Link>

        <Link className="breadcrumb-item" to={`/decks/${deckId}`}>
          {deck.name}
        </Link>
        <li className="breadcrumb-item active">Study</li>
      </ol>

      <div>
        <h2>{`${deck.name}: Study`}</h2>
        <div>
          {cards.length === 0
            ? notEnoughCards()
            : cards.length > 2
            ? enoughCards()
            : notEnoughCards()}
        </div>
      </div>
    </>
  );
}

export default Study;
