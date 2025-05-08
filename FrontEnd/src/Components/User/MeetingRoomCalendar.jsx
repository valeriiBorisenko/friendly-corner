import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../config";
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MeetingRoomCalendar = () => {
  const [myEvents, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [title, setTitle] = useState("");

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/booking/events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, []);

  const openModal = (start, end) => {
    setSelectedSlot({ start, end });
    setStartTime(start);
    setEndTime(end);
  };

  const handleSaveEvent = async () => {
    if (!startTime || !endTime || !title || startTime >= endTime) {
      alert("Please provide a title and select valid start and end times.");
      return;
    }

    const isSlotAvailable = await checkAvailability(startTime, endTime);
    if (!isSlotAvailable) {
      alert("Sorry, the room is already booked for the selected time.");
      return;
    }

    const bookingData = {
      Date: moment(startTime).format("YYYY-MM-DD"),
      TimeSlot: moment(startTime).format("YYYY-MM-DD HH:mm"),
      EndTime: moment(endTime).format("YYYY-MM-DD HH:mm"),
      UserId: 1,
      Title: title,
    };

    try {
      await axios.post(`${BASE_URL}/api/booking/book`, bookingData);
      alert("Booking confirmed");

      setEvents((prevEvents) => [
        ...prevEvents,
        { start: startTime, end: endTime, title },
      ]);
      setTitle("");
      setStartTime(null);
      setEndTime(null);
    } catch (error) {
      console.error("Error booking slot", error);
      alert("Error booking slot, please try again.");
    }
  };

  const checkAvailability = async (start, end) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/booking/availability?start=${moment(start).format("YYYY-MM-DD HH:mm")}&end=${moment(end).format("YYYY-MM-DD HH:mm")}`
      );
      return response.data.isAvailable;
    } catch (error) {
      console.error("Error checking availability", error);
      return false;
    }
  };

  const handleSelectEvent = useCallback((event) => alert(event.title), []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  return (
    <div style={styles.calendarContainer}>
      <h2>Meeting Room Booking</h2>
      <Calendar
        defaultDate={defaultDate}
        events={myEvents}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={({ start, end }) => openModal(start, end)}
        selectable
        style={styles.calendar}
        scrollToTime={scrollToTime}
        step={30}
        timeslots={2}
        views={['month', 'week', 'day']} // Show only Month, Week, and Day views
        components={{
          header: ({ label }) => (
            <div style={styles.header}>
              <span>{label}</span>
            </div>
          ),
        }}
      />
      {/* Modal for Custom Time Selection */}
      {selectedSlot && (
        <div style={styles.modal}>
          <h2>Select Time</h2>
          <div>
            <label>Booking Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              style={styles.input}
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={moment(startTime).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => setStartTime(new Date(e.target.value))}
              style={styles.input}
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="datetime-local"
              value={moment(endTime).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => setEndTime(new Date(e.target.value))}
              style={styles.input}
            />
          </div>
          <button onClick={handleSaveEvent} style={styles.button}>Book Room</button>
          <button onClick={() => setSelectedSlot(null)} style={styles.cancelButton}>Cancel</button>
        </div>
      )}
      {/* Space for additional buttons */}
      {/* <div style={styles.buttonsContainer}>
        <button style={styles.button}>Logout</button>
      </div> */}
    </div>
  );
};

// Inline styles for the modal and full-page calendar
const styles = {
  calendarContainer: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh", // Full height of the page
  },
  calendar: {
    width: "100%",
    height: "60vh", // Calendar takes up most of the viewport
    margin: "0 auto",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 20px",
    margin: "10px 5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#8B4513", // Brown color for Book Room button
    color: "white",
  },
  cancelButton: {
    padding: "10px 20px",
    margin: "10px 5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#8B4513", // Brown color for Cancel button
    color: "white",
  },
  buttonsContainer: {
    marginTop: "20px", // Adds some space between modal and the buttons
  },
  header: {
    backgroundColor: "#4CAF50", // Green background for the header
    color: "white",
    textAlign: "center",
    padding: "10px 0",
    fontWeight: "bold",
  },
};

export default MeetingRoomCalendar;