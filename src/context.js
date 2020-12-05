import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import Client from "./contentful";

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [state, setState] = useState({
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true,
    type: "all",
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false,
  });

  const getData = useCallback(async () => {
    console.count("render");
    try {
      let response = await Client.getEntries({
        content_type: "beachResortRoom",
        order: "fields.capacity",
      });
      let rooms = formatData(response.items);
      let featuredRooms = rooms.filter((room) => room.featured === true);
      let maxPrice = Math.max(...rooms.map((item) => item.price));
      let maxSize = Math.max(...rooms.map((item) => item.size));
      setState({
        ...state,
        rooms,
        featuredRooms,
        sortedRooms: rooms,
        loading: false,
        maxPrice,
        maxSize,
        price: maxPrice,
      });
    } catch (error) {
      console.log(error);
    }
  }, [null]);

  const getRoom = (slug) => {
    let tempRooms = [...state.rooms];
    const room = tempRooms.find((room) => room.slug === slug);
    return room;
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    filterRooms({ ...state, [name]: value });
  };

  const filterRooms = (state) => {
    let {
      rooms,
      type,
      capacity,
      price,
      minSize,
      maxSize,
      breakfast,
      pets,
    } = state;

    capacity = parseInt(capacity);
    price = parseInt(price);

    if (type !== "all") {
      rooms = rooms.filter((room) => room.type === type);
    }

    if (capacity !== 1) {
      rooms = rooms.filter((room) => room.capacity >= capacity);
    }

    rooms = rooms.filter((room) => room.price <= price);

    rooms = rooms.filter(
      (room) => room.size >= minSize && room.size <= maxSize
    );

    if (breakfast) {
      rooms = rooms.filter((room) => room.breakfast === true);
    }

    if (pets) {
      rooms = rooms.filter((room) => room.pets === true);
    }

    setState({ ...state, capacity, sortedRooms: rooms });
  };

  const formatData = (items) => {
    let tempItems = items.map((item) => {
      let id = item.sys.id;
      let images = item.fields.images.map((image) => image.fields.file.url);
      let room = { ...item.fields, images, id };
      return room;
    });
    return tempItems;
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <RoomContext.Provider value={{ ...state, getRoom, handleChange }}>
      {children}
    </RoomContext.Provider>
  );
};

const useRoomContext = () => {
  return useContext(RoomContext);
};

export { RoomProvider, useRoomContext };
