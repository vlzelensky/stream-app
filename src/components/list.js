import React, { useState, useCallback, useRef, useEffect } from "react";
import io from "socket.io-client";
import { Alert, Table } from "react-bootstrap";
import Header from "../components/header.js";
import Event from "../components/event.js";

const List = () => {
  const [state, setState] = useState({
    isStreamActive: true,
    filterValue: "",
    filteredEvents: [],
  });
  const [error, setError] = useState(null);

  const eventsRef = useRef([]);
  const socketRef = useRef({});

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const turnSocketOn = useCallback(() => {
    socketRef.current = io("http://localhost:8000/");

    socketRef.current.on("events", (events) => {
      const storedEvents = Array.isArray(eventsRef.current)
        ? eventsRef.current
        : [];
      eventsRef.current = [...events, ...storedEvents];
      setError(null);
      forceUpdate();
    });

    socketRef.current.on("connect_error", () => {
      setError("Server unavailable");
    });

    socketRef.current.on("error", () => {
      setError("Server error");
    });
  }, [forceUpdate]);

  const turnSocketOff = useCallback(() => {
    socketRef.current?.close();
  }, []);

  useEffect(() => {
    const isActive = state.isStreamActive;

    if (isActive) {
      turnSocketOn();
    } else {
      turnSocketOff();
    }

    return () => turnSocketOff();
  }, [turnSocketOn, turnSocketOff, state.isStreamActive]);

  const eventList = useCallback(
    () =>
      eventsRef.current.filter((event) => {
        const lowerFilterValue = state.filterValue.toLowerCase();
        return (
          `${event.properties?.path}`
            .toLowerCase()
            .includes(lowerFilterValue) ||
          `${event.traits?.email}`.toLowerCase().includes(lowerFilterValue) ||
          `${event.type}`.toLowerCase().includes(lowerFilterValue) ||
          `${event.event}`.toLowerCase().includes(lowerFilterValue) ||
          `${event.receiveTime}`.toLowerCase().includes(lowerFilterValue)
        );
      }),
    [state.filterValue, eventsRef]
  );

  const switchStreamStatus = (isActive) => {
    setState({
      ...state,
      isStreamActive: isActive,
    });
  };

  const findEvent = (filterValue) => {
    setState({
      ...state,
      filterValue,
    });
  };
  return (
    <>
      {error && (
        <Alert className="alert" variant="danger">
          {error}
        </Alert>
      )}
      <Header
        search={findEvent}
        filterValue={state.filterValue}
        errorMessage={error}
        isStreamActive={state.isStreamActive}
        switchStreamStatus={switchStreamStatus}
      />
      {eventList && (
        <Table>
          <tbody>
            {eventList().map((element, i) => (
              <Event element={element} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default List;
