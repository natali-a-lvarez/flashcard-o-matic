import React from "react";
import { listDecks } from "../utils/api";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Study() {
  const history = useHistory();
  const [deck, setDeck] = useState([]);

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

  return <p>study</p>;
}

export default Study;
