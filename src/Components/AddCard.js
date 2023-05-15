import React, { useEffect, useState } from "react";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { createCard } from "../utils/api";
import { readDeck } from "../utils/api";
import CardForm from "../Components/CardForm";

function AddCard() {
  const { deckId } = useParams();
  const history = useHistory();
  const initialCardState = {
    front: "",
    back: "",
  };
  const [deck, setDeck] = useState([]);
  const [newCard, setNewCard] = useState(initialCardState);

  useEffect(() => {
    async function fetchData() {
      const abortController = new AbortController();
      try {
        const deckResponse = await readDeck(deckId, abortController.signal);
        setDeck(deckResponse);
      } catch (error) {
        console.error("Something went wrong", error);
      }
      return () => {
        abortController.abort();
      };
    }
    fetchData();
  }, [deckId]);

  function handleChange({ target }) {
    setNewCard({
      ...newCard,
      [target.name]: target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(newCard);
    const abortController = new AbortController();
    const response = await createCard(
      deckId,
      { ...newCard },
      abortController.signal
    );
    history.push(`/decks/${deck.id}`);
    return response;
  }

  async function handleDone() {
    history.push(`/decks/${deck.id}`);
  }

  return (
    <div>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        </li>
        <li className="breadcrumb-item active">Add Card</li>
      </ol>
      <CardForm
        handleSubmit={handleSubmit}
        handleDone={handleDone}
        handleChange={handleChange}
        deck={deck}
      />
    </div>
  );
}

export default AddCard;
