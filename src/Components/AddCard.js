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

  async function handleCancel() {
    history.push(`/decks/${deck.id}`);
  }

  return (
    <>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/">{deck.name}</Link>
        </li>
        <li className="breadcrumb-item active">Create Card</li>
      </ol>

      <h2>{`${deck.name}: Add Card`}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="front" className="form-label">
            Front
          </label>
          <textarea
            name="front"
            placeholder="Front side of card"
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
            placeholder="Back side of card"
            id="back"
            onChange={handleChange}
          />
        </div>
        <button onClick={handleCancel} className="btn btn-secondary mx-2">
          Done
        </button>
        <button
          onSubmit={handleSubmit}
          type="submit"
          className="btn btn-primary"
        >
          Save
        </button>
      </form>
    </>
  );
}

export default AddCard;
