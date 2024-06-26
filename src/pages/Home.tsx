import { useState, useEffect } from "react";
import ArtistField from "../components/ArtistField";
import { TypeArtistProduct } from "../components/types/Types";

const backendUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_URL_DEVELOPMENT
    : process.env.REACT_APP_BACKEND_URL_PRODUCTION;

export const Home = () => {
  const [artists, setArtists] = useState<TypeArtistProduct[]>([
    {
      artist: { name: "load", photo: "load", artistId: "load" },
      productEntityList: [
        {
          product: "load",
          ammount: "load",
          photo: "load",
          productId: "load",
          price: "load",
          artistId: "load",
        },
      ],
    },
  ]);

  useEffect(() => {
    fetch(backendUrl + "/productByArtist", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);
      });
  }, []);

  return <ArtistField artistProducts={artists} />;
};

export default Home;
