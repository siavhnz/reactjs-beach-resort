import React from "react";
import RoomsFilter from "./RoomsFilter";
import RoomsList from "./RoomsList";
import { useRoomContext } from "../context";
import Loading from "./Loading";

const RoomContainer = () => {
  const { loading } = useRoomContext();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <RoomsFilter />
      <RoomsList />
    </>
  );
};

export default RoomContainer;
