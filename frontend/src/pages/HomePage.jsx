// import React from 'react'

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import NoteCard from "../components/NoteCard.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
// import axios from "axios";

const Homepage = () => {
  const [ isRateLimited, setIsRateLimited ] = useState(false);
  const [ notes,setNotes ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        // const data = await res.json();
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        toast.error("Error Fetching logs");
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar></Navbar>
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt06">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard 
                key={note._id} 
                note={note} 
                setNotes={setNotes} 
              />
            ))}
          </div>
        )}
      </div>  
    </div>
  )
}

export default Homepage
