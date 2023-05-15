import React, { useEffect, useState } from "react";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { createCard, readCard } from "../utils/api";
import { readDeck } from "../utils/api";

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
  }, []);

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
      <form onSubmit={handleSubmit}>
        <h2>{deck.name}: Add Card</h2>
        <div className="form-group">
          <label>Front</label>
          <textarea
            id="front"
            name="front"
            className="form-control"
            onChange={handleChange}
            type="text"
            value={newCard.front}
            placeholder="Front side of card."
          />
        </div>
        <div className="form-group">
          <label>Back</label>
          <textarea
            id="back"
            name="back"
            className="form-control"
            onChange={handleChange}
            type="text"
            value={newCard.back}
            placeholder="Back side of card."
          />
        </div>
        <button className="btn btn-secondary mx-1" onClick={() => handleDone()}>
          Done
        </button>
        <button className="btn btn-primary mx-1" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

export default AddCard;
