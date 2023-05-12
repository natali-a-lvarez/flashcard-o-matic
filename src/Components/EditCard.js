import React, { useState, useEffect } from "react";
import {
  useParams,
  useHistory,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { readDeck, readCard, updateCard } from "../utils/api";

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
  }, []);

  function handleChange({ target }) {
    setCard({
      ...card,
      [target.name]: target.value,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const abortController = new AbortController();
    const response = await updateCard({ ...card }, abortController.signal);
    history.push(`/decks/${deckId}`);
    return response;
  }

  async function handleCancel() {
    history.push(`/decks/${deckId}`);
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

      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label htmlFor="front" className="form-label">
            Front
          </label>
          <textarea
            name="front"
            value={card.front}
            className="form-control"
            id="front"
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="description" className="form-label">
            back
          </label>
          <textarea
            className="form-control"
            name="back"
            value={card.back}
            id="back"
            onChange={handleChange}
          />
        </div>
        <button onClick={handleCancel} className="btn btn-secondary mx-2">
          Cancel
        </button>
        <button
          onSubmit={handleUpdate}
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default EditCard;
