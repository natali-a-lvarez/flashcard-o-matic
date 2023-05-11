import React from "react";
import { listDecks } from "../utils/api";
import { useState, useEffect } from "react";
import {
  useHistory,
  Link,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { Breadcrumb } from "react-bootstrap";

function Study() {
  const history = useHistory();
  const [deck, setDeck] = useState([]);
  const { deckId } = useParams();
  console.log(deckId);

  useEffect(() => {
    async function fetchData() {
      const abortController = new AbortController();
      try {
        const deckResponse = await listDecks(abortController.signal);
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

  console.log(deck);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/decks/:deckId/">Placeholder</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Study</Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
}

export default Study;
