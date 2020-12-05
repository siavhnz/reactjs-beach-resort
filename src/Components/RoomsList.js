import React from "react";
import { useRoomContext } from "../context";
import Room from "./Room";

const RoomsList = () => {
  const { sortedRooms: rooms } = useRoomContext();

  if (rooms.length === 0) {
    return (
      <div className="empty-search">
        <h3>unfortunately no rooms matched your search parameters</h3>
      </div>
    );
  }

  return (
    <section className="roomslist">
      <div className="roomslist-center">
        {rooms.map((item) => {
          return <Room key={item.id} {...item} />;
        })}
      </div>
    </section>
  );
};

export default RoomsList;
