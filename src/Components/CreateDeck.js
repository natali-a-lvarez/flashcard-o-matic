import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function CreateDeck() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Create Deck</Breadcrumb.Item>
      </Breadcrumb>

      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            placeholder="Deck Name"
            className="form-control"
            id="name"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            placeholder="Brief description of deck"
            id="description"
          />
        </div>
        <Link type="submit" className="btn btn-secondary" to="/">
          Cancel
        </Link>
        <Link type="submit" className="btn btn-primary" to="/decks/:deckId">
          Submit
        </Link>
      </form>
    </>
  );
}

export default CreateDeck;
