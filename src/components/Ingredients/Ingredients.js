import React, {
  useEffect,
  useState,
  useCallback,
  useReducer,
  useMemo,
} from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return { i: action.ingredients };
    case "FILTER":
      return { i: state.i.filter((ig) => ig.title.includes(action.term)) };
    case "ADD":
      return { i: state.i.concat(action.ingredient) };
    case "DELETE":
      return { i: state.i.filter((ig) => ig.id !== action.id) };
    default:
      throw new Error("Error occurred");
  }
};

const initialUserIngredients = { i: [] };

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(
    ingredientReducer,
    initialUserIngredients
  );

  //const [httpState, dispatchHttp] = useReducer(httpReducer, initialHttpState);

  //const [userIngredients, setUserIngredients] = useState([]);
  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState(null);

  const [filtered, setFiltered] = useState("");
  const filteringMine = useCallback((enteredFilter) => {
    setFiltered(enteredFilter);
  }, []);

  const { isLoading, error, data, sendRequest,reqExtra, reqIdentifier,clear } = useHttp();

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest('https://hooks-summary-8ee9c-default-rtdb.firebaseio.com/ingredients.json',
    'POST',JSON.stringify(ingredient),ingredient, 'ADD_INGREDIENT')
  }, [sendRequest]);

  const removeItemHandler = useCallback(
    (id) => {
      sendRequest(
        `https://hooks-summary-8ee9c-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        'REMOVE_INGREDIENT'
      )
    },
    [sendRequest]
  );

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: "DELETE", id:reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: "ADD", ingredient: { id: data.name, ...reqExtra } });
    }
    
  }, [data,reqExtra, isLoading, error,reqIdentifier]);

  useEffect(() => {
    fetch(
      "https://hooks-summary-8ee9c-default-rtdb.firebaseio.com/ingredients.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const loadedItems = [];
        for (const key in data) {
          const loadedItem = {
            id: key,
            ...data[key],
            //title: data[key].title,
            //amount: data[key].amount,
          };
          loadedItems.push(loadedItem);
        }
        if (filtered.trim().length === 0) {
          //setUserIngredients(loadedItems);
          dispatch({ type: "SET", ingredients: loadedItems });
        } else {
          //setUserIngredients((ingredients) => {
          //  return ingredients.filter((ig) => ig.title.includes(filtered));
          dispatch({ type: "FILTER", term: filtered });
        }
      });
  }, [filtered]);


  const ing = userIngredients.i;

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={ing} onRemoveItem={removeItemHandler} />
    );
  }, [ing, removeItemHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      <section>
        <Search onFiltering={filteringMine} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
