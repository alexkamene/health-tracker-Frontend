'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const exerciseTypes = [
  { name: 'Walking slowly', met: 2.0 },
  { name: 'Yoga (asanas + pranayama)', met: 3.3 },
  { name: 'Walking at 3.0 mph', met: 3.0 },
  { name: 'Sweeping/mopping floors', met: 3.5 },
  { name: 'Tennis (doubles)', met: 5.0 },
  { name: 'Weight lifting (moderate)', met: 5.0 },
  { name: 'Bicycling (10 mph, flat)', met: 6.0 },
  { name: 'Aerobic dancing', met: 6.0 },
  { name: 'Jumping jacks', met: 6.5 },
  { name: 'Basketball game', met: 8.0 },
  { name: 'Swimming (moderate)', met: 8.0 },
  { name: 'Jogging (5.6 mph)', met: 8.8 },
  { name: 'Rope jumping (66/min)', met: 9.8 },
  { name: 'Football', met: 10.3 },
  { name: 'Rope jumping (100/min)', met: 11.0 },
  { name: 'Jogging (6.8 mph)', met: 11.2 },
];

export default function ExerciseTracker() {
  const [selectedExercise, setSelectedExercise] = useState(exerciseTypes[0]);
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState(70); // assume user weight in kg
  const [calories, setCalories] = useState(0);
  const [token, setToken] = useState('');
  const [Exercises, setExercises] = useState([]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://heath-tracker-backend.onrender.com/my-exercises', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(res.data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };
  
    fetchExercises();
  }, []);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (duration && selectedExercise) {
      const durationInHours = parseFloat(duration) / 60;
      const burned = selectedExercise.met * weight * durationInHours;
      setCalories(Math.round(burned));
    }
  }, [duration, selectedExercise, weight]);

  const saveExercise = async () => {
    if (!duration) return alert('Please enter duration');
    try {
      await axios.post(
        'https://heath-tracker-backend.onrender.com/exercise/add',
        {
          name: selectedExercise.name,
          duration: parseFloat(duration),
          caloriesBurned: calories,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('✅ Exercise saved!');
      setDuration('');
    } catch (err) {
      console.error('Error saving exercise:', err);
      alert('❌ Failed to save exercise.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">🚴 Exercise Tracker</h2>

      <label className="block mb-2 font-semibold">Select Exercise:</label>
      <select
        value={selectedExercise.name}
        onChange={(e) =>
          setSelectedExercise(
            exerciseTypes.find((ex) => ex.name === e.target.value)
          )
        }
        className="border p-2 w-full rounded mb-4"
      >
        {exerciseTypes.map((exercise, idx) => (
          <option key={idx} value={exercise.name}>
            {exercise.name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Duration (minutes):</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border p-2 w-full rounded mb-4"
        placeholder="Enter duration"
      />

      <label className="block mb-2 font-semibold">Your Weight (kg):</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(parseFloat(e.target.value))}
        className="border p-2 w-full rounded mb-4"
      />

      <p className="mb-4 text-blue-600 font-medium">
        🔥 Estimated Calories Burned: <span className="font-bold">{calories}</span> kcal
      </p>

      <button
        onClick={saveExercise}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Save Exercise
      </button>

      <h3 className="text-lg font-semibold mt-8 mb-4">📋 Your Exercises</h3>
<ul className="space-y-2">
  {Exercises.length === 0 && (
    <p className="text-gray-500">No exercises saved yet.</p>
  )}
  {Exercises.map((ex, idx) => (
    <li key={idx} className="p-3 border rounded bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{ex.exerciseType || ex.name}</p>
          <p className="text-sm text-gray-600">
            Duration: {ex.duration} mins | Calories: {ex.caloriesBurned} kcal
          </p>
        </div>
        <span className="text-xs text-gray-400">{new Date(ex.date).toLocaleDateString()}</span>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}
