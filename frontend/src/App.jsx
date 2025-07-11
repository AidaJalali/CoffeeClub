import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [todaysPlan, setTodaysPlan] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodaysPlan = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/plans/today');
                if (response.status === 204 || response.headers.get("content-length") === "0") {
                    // Handle empty response for "no plan today"
                    return;
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTodaysPlan(data);
            } catch (e) {
                setError(e.message);
                console.error("Could not fetch the plan:", e);
            }
        };

        fetchTodaysPlan();
    }, []);

    return (
        <>
            <h1>Today's Coffee Plan</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {todaysPlan && todaysPlan.coffeeMakerIds ? ( // <-- Check for coffeeMakerIds here
                <div>
                    <h2>Makers for {todaysPlan.date}:</h2>
                    <ul>
                        {todaysPlan.coffeeMakerIds.map(makerId => (
                            <li key={makerId}>
                                User ID: {makerId}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                !error && <p>No plan found for today. Please generate a weekly plan first.</p>
            )}
        </>
    )
}

export default App