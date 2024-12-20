import { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";

const Body = () => {
  const [resList, setResList] = useState([]);
  const [copyList, setCopyList] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.65200&lng=77.16630&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );

    const json = await data.json();

    setResList(
      json.data.cards[4].card.card.gridElements.infoWithStyle.restaurants
    );

    setCopyList(
      json.data.cards[4].card.card.gridElements.infoWithStyle.restaurants
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      buttonPressed();
    }
  };

  const buttonPressed = () => {
    const filterList = resList.filter((item) =>
      item.info.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setCopyList(filterList);
    setSearchText("");
  };

  const onlineStatus = useOnlineStatus();

  if (!onlineStatus) return <h1>Oops you are not connected to Internet</h1>; // "!onlineStatus" = "onlineStatus == false"

  // conditional rendering

  return resList.length == 0 ? (
    <Shimmer />
  ) : (
    <div>
      <div className="flex gap-2  bg-blue-100 p-2">
        <div className="border-2 rounded-md">
          <input
            className="shadow-md"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-slate-300 px-2 shadow-md hover:scale-110 transition-all ease-in-out"
            onClick={buttonPressed}
          >
            Search
          </button>
        </div>
        <button
          className="bg-pink-200 rounded-md px-2 shadow-md hover:scale-110 transition-all ease-in-out"
          onClick={() => {
            const filterList = resList.filter(
              (item) => item.info.avgRating >= 4.3
            );
            setCopyList(filterList);
          }}
        >
          Top Rated Restaurants
        </button>

        <button
          className="bg-green-300 rounded-md px-2 shadow-md hover:scale-110 transition-all ease-in-out"
          onClick={() => {
            setCopyList(resList);
          }}
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-4 justify-normal gap-10 bg-[#a8bd66] p-8">
        {copyList.map((restaurant, index) => {
          const link = "/restaurant/" + restaurant?.info?.id;
          return (
            <Link key={restaurant.info.id} to={link}>
              <RestaurantCard resData={restaurant} index={index} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Body;
