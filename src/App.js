import { useState, useEffect } from "react";
import SearchBar from "./components/searchBar/SearchBar";
import Button from "./components/button/Button";
import { Card } from 'react-bootstrap';


let index = 0;
let page = 1;
let keyIndex = 0;
function App () {
  const [arrData, setArrData] = useState([]);
  const [getVal, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [point, setPoint] = useState(0);
  const [mistake, setMistake] = useState(0);
  const [mask, setMask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // const [isEqual, setIsEqual] = useState("");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const getData = async () => {
      setLoading(true);
      const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=3ea267b080ab0b3beccefd9db1750c02&language=en-US&page=${page}`;
      const data = await fetch(url);
      const res = await data.json();
      console.log(res);
      setArrData(res.results); // all data
      setMovieName(res.results[index].name.toLowerCase());
      const masked = maskName(res.results[index].name.toLowerCase());
      console.log(masked);
      setMask(masked);
      setLoading(false);
    };
    getData();
  };

  const nextCell = () => {
    IsEqual(movieName, getVal);
    index = index + 1;// the number of movie from 0-19
    const newArr = [...arrData]; //all data
    setMovieName(newArr[index].name.toLowerCase()); //movie name
    const masked = maskName(newArr[index].name.toLowerCase());
    setMask(masked); // mask name result
    console.log(masked);

    if (index === 19) {
      page++;
      index = 0;
      fetchData();
    }
    setSearchTerm("");
  };

  const IsEqual = (val, getVal) => {
    if (val.toLowerCase() === getVal.toLowerCase()) {
      setPoint(prev => prev + 1);
      console.log("equal");
    } else {
      setMistake(prev => prev + 1);
      console.log("not equal");
    }
  };

  const maskName = val => {
    let maskedName = val;
    for (let i = 0;i < val.length / 2;i++) {
      const rndInt = Math.floor(Math.random() * val.length) + 0;
      if (val[rndInt] !== " ")
        maskedName = maskedName.replace(val[rndInt], "_");
    }
    return maskedName;
  };

  const newMask = mask.split("").map((el, i) => {
    if (el === "_")
      return (
        <span className="emptyCard" key={i} onClick={() => console.log("yes")}>
          {el}
        </span>
      );
    else return <span key={i}>{el}</span>;
  });


  const onKeyPressed = (event) => {
    console.log("keyIndex", keyIndex)
    if (event.key !== "Backspace" || event.key !== "Delete")
      keyIndex += 1;
    if ((event.key === "Backspace" || event.key === "Delete") && keyIndex >= 0)
      keyIndex -= 2;

    if(keyIndex < 0)
    keyIndex = 0;

    console.log(event)
    console.log(keyIndex)

    

  }
  return (
    <div className="App_container">
      <div style={{ display: "flex", justifyContent: "center", backgroundColor: 'red', color: 'white' }}>
        <h1>Guess the TV show name</h1>
      </div>
      <br />

      <Card style={{ display: "flex", justifyContent: "center" }} >
        <Card.Title style={{ alignSelf: "center" }}>{movieName}</Card.Title>
        <Card.Title style={{ alignSelf: "center" }}>{newMask}</Card.Title>
        <input type="text" onKeyDown={onKeyPressed}></input>


        {/* <SearchBar
          setVal={setVal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        /> */}
      </Card>
      {
        loading ? (
          "...loading"
        ) : (
          <>
            <Button type="button" className="" onClick={nextCell} text="click" />
            <p> point: {point}</p>
            <p> mistake: {mistake}</p>
          </>
        )
      }
    </div >
  );
}

export default App;
