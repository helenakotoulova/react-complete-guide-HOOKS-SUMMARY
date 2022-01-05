import React, { useEffect, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onFiltering } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

 const changeHandler = (event) => {
   setEnteredFilter(event.target.value);
 }

 useEffect(() => {
   onFiltering(enteredFilter.trim())
 }, [enteredFilter, onFiltering])
 
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enteredFilter} onChange={changeHandler} />
        </div>
      </Card>
    </section>
  );
});

export default Search;


/*
Ve Firebase upravime rules na:
{
  "rules": {
    ".read": true,
    ".write": true,
      "ingredients": {
        ".indexOn": ["title"]
      }
  }
}

Ale ted se ten useEffect spousti moc casto kvuli te fci onFilteredIngredients => pouzijeme useCallback
do komponenty Ingredients na filterHandler
On to mel takhle: 
useEffect(() => {
    const query =
      enteredFilter.length === 0
        ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
        console.log(query)
    fetch(
      "https://hooks-summary-8ee9c-default-rtdb.firebaseio.com/ingredients.json" +
        query
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const loadedItems = [];
        for (const key in data) {
          const loadedItem = {
            id: key,
            title: data[key].title,
            amount: data[key].amount,
          };
          loadedItems.push(loadedItem);
        }
        //onFilteredIngredients(loadedItems);
        console.log(loadedItems)
        onFiltering(enteredFilter)
      });
  }, [ enteredFilter, onFiltering]);

A tohle mel v Ingredients.js:  
const filterHandler = useCallback(filteredItems => {
    setUserIngredients(filteredItems);
  },[]);
Ale nefungovalo mi to.
  
  */

