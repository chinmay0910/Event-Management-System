import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../app.css';
import { useNavigate } from 'react-router-dom';

function SystemDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch room data from backend API
    fetch('http://localhost:5000/api/room')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        return response.json();
      })
      .then(data => {
        setRooms(data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);



  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('Fetched data:', data); // Log fetched data
      setData(data);
      setLoading(false); // Update loading state once data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Update loading state in case of error
    }
  };



  const handleVenueAssignment = async (id) => {
    // Logic for venue assignment goes here
    console.log(`Assigning venue for item with ID: ${id}`);
  };

  const handleRoomAllocation = async (id) => {
    // Logic for room allocation goes here
    console.log(`Allocating room for item with ID: ${id}`);

    navigate(`/roombooking/${id}`);
  };

  const handleCancelEvent = async (eventId, cancelType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/data/cancelRoomBooking/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'FrAngel-auth-token': `${localStorage.getItem('FrAngel-auth-token')}` // Assuming you store the access token in localStorage
        },
        body: JSON.stringify({ cancelType })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel room booking');
      }

      const data = await response.json();
      alert(data.message); // Set cancel message if needed
      fetchData();
    } catch (error) {
      console.error('Error cancelling room booking:', error);
      alert('Failed to cancel room booking');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">System Dashboard</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name of the Committee</th>
            <th className="border px-4 py-2">Event Type</th>
            <th className="border px-4 py-2">Event Name</th>
            <th className="border px-4 py-2">Convenor Name</th>
            <th className="border px-4 py-2">Event Date</th>
            <th className="border px-4 py-2">Duration</th>
            <th className="border px-4 py-2">POA PDF</th>
            <th className="border px-4 py-2">Allot Venue</th>
          </tr>
        </thead>
        <tbody>
          {loading ?
            (
              <tr>
                <td colSpan="9" className="border px-4 py-2 text-center">Loading...</td>
              </tr>
            ) :
            data.length > 0 ? (data.map((item, i) => (
              <tr key={i + 1}>
                <td className="border px-4 py-2">{i + 1}</td>
                <td className="border px-4 py-2">{item.committeeName}</td>
                <td className="border px-4 py-2">{item.eventType}</td>
                <td className="border px-4 py-2">{item.eventName}</td>
                <td className="border px-4 py-2">{item.convenorName}</td>
                <td className="border px-4 py-2">{new Date(item.eventDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{item.duration}</td>
                <td className="border px-4 py-2">
                  <a href={`http://localhost:5000/uploads/${item.poaPdf}`} className='text-indigo-500 hover:underline' target="_blank" rel="noopener noreferrer">View PDF</a>
                </td>
                <td className="border px-4 py-2">
                  {item.cancelled === 2 ? (
                    <p className='text-red-500 text-lg font-bold'>Event Cancel</p>
                  ) : rooms.some(room => room.eventId.some(eventId => eventId === item._id)) ? (
                    <div>
                      <h1>{item.committeeName + "\n" + new Date(item.eventDate).toLocaleDateString()} <br /> Room Allocated: {rooms.find(room => room.eventId.some(eventId => eventId === item._id)).roomNumber}</h1>
                      {item.cancelled === 1 ? (
                        <button className='bg-orange-500 hover:bg-orange-600 px-2 rounded text-wrap text-white' onClick={() => handleCancelEvent(item._id, 'confirmcancel')}>Confirm Cancel</button>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleRoomAllocation(item._id)}
                    >
                      Allocate Room
                    </button>
                  )}
                </td>
              </tr>
            ))
            ) :
              (
                <tr>
                  <td colSpan="9" className="border px-4 py-2 text-center">No data available</td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
}

export default SystemDashboard;
