import React, { useState, useEffect } from "react";
import {
  useHistory,
  useParams,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck } from "../utils/api";
import { deleteDeck, deleteCard } from "../utils/api";

function Study() {
  const history = useHistory();
  const { deckId } = useParams();
  const [deck, setDeck] = useState({});
  const [cards, setCards] = useState([]);

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

      <h2>{`Study: ${deck.name}`}</h2>
    </>
  );
}

export default Study;
