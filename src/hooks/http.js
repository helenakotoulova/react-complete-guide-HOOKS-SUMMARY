// nemuzeme z nejake funkce volat dispatchovani akci na zmenu stavu, to muzou delat jenom hooky

import { useReducer, useCallback } from "react";

const initialHttpState = { loading: false, error: null, data:null,extra:null, identifier:null };

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null, data: null, extra:null, identifier:action.identifier};
    case "RESPONSE":
      return { ...state, loading: false, data:action.responseData,extra:action.extra };
    case "ERROR":
      return { ...state,loading: false, error: action.errorMessage };
    case "CLEAR":
      return {initialHttpState };
    default:
      throw new Error("Something went wrong");
  }
};

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialHttpState);
    
    const clear = useCallback(() => {
        dispatchHttp({type:'CLEAR'})
    },[])

    const sendRequest = useCallback((url,method,body,reqExtra,reqIdentifier) => {
        dispatchHttp({type:'SEND', identifier:reqIdentifier});
        fetch(url, {
            method:method,
            body:body,
            headers: { "Content-type": "application/json" },
        })
      .then((response) => {
        // tady me nezajima ta response. jen chci nastavit userINgredients na ty zbyle, aby se mi zobrazovaly jen ty zbyle
        //setUserIngredients((ingredients) => {
        // return ingredients.filter((ig) => ig.id !== id);
        return response.json(); 
      }).then(responseData => {
        dispatchHttp({ type: "RESPONSE", responseData:responseData,extra: reqExtra });
      })
      .catch((error) => {
        //setError(error.message);
        //setError("Something went wrong!");
        //setIsLoading(false);
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
      })},[]);
    return {
        isLoading:httpState.loading,
        error: httpState.error,
        data:httpState.data,
        sendRequest: sendRequest,
        reqExtra:httpState.extra,
        reqIdentifier:httpState.identifier,
        clear:clear,
    }
}

export default useHttp;