import React, { useState, useEffect } from "react";
import {
  useParams,
  useHistory,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck, readCard, updateCard } from "../utils/api";
import CardForm from "./CardForm";

function EditCard() {
  const { deckId, cardId } = useParams();
  const history = useHistory();
  const initialCardState = {
    id: "",
    front: "",
    back: "",
  };
  const [deck, setDeck] = useState([]);
  const [card, setCard] = useState(initialCardState);
  const editCard = true;

  useEffect(() => {
    async function fetchData() {
      const abortController = new AbortController();
      try {
        const deckResponse = await readDeck(deckId, abortController.signal);
        const cardResponse = await readCard(cardId, abortController.signal);
        setDeck(deckResponse);
        setCard(cardResponse);
      } catch (error) {
        console.error("Something went wrong", error);
      }
      return () => {
        abortController.abort();
      };
    }
    fetchData();
  }, [deckId, cardId]);

  function handleChange({ target }) {
    setCard({
      ...card,
      [target.name]: target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const abortController = new AbortController();
    const response = await updateCard({ ...card }, abortController.signal);
    history.push(`/decks/${deckId}`);
    return response;
  }

  async function handleDone() {
    history.push(`/decks/${deck.id}`);
  }

  return (
    <>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        </li>
        <li className="breadcrumb-item active">{`Edit Card ${cardId}`}</li>
      </ol>

      <h2>Edit Card</h2>

      <CardForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleDone={handleDone}
        deck={deck}
        card={card}
        edit={editCard}
      />
    </>
  );
}

export default EditCard;
