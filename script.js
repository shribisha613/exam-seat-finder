// Load JSON data

const ukRooms = [
    "Thames", // Example room names for UK block
    "Big Ben",
    "Stonehenge",
    "Open Access",
    "Kingstone"
];


fetch('data.json')
    .then(response => response.json())
    .then(data => {
        hallData = data;
        // Add event listener for Enter key
        document.getElementById("searchInput").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                searchStudent();
            }
        });
    })
    .catch(err => console.error('Error loading data:', err));

function searchStudent() {
    const name = document.getElementById("searchInput").value.trim().toUpperCase();
    const resultDiv = document.getElementById("result");
    const entranceInfoDiv = document.getElementById("entrance-info-container");
    resultDiv.innerHTML = "";
    entranceInfoDiv.innerHTML = "";

    if (!name) {
        resultDiv.innerHTML = `
            <div class="not-found">
                <p>Please enter your full name as it appears in college records</p>
                <p>Example: "Alex Devkota" or "Bimal Pandey"</p>
            </div>`;
        return;
    }

    let found = false;

    for (let hallName in hallData) {
        const hall = hallData[hallName];
        const seats = hall.seats;
        const maxRow = hall.max_row;
        const maxCol = hall.max_col;
        const entrance = hall.entrance; // Entrance is given as [row, col]
        const block = ukRooms.includes(hallName) ? "UK" : "Nepal"; // Assign block based on room name
        // Search for the student in seats
        for (let seatNumber in seats) {
            const seat = seats[seatNumber];
            if (seat.student.toUpperCase() === name) {
                found = true;

                // Build student details in horizontal row
                const studentDetails = `
                    <div class="student-details">
                        <div class="detail-item">
                            <span class="detail-label">Full Name</span>
                            <span class="detail-value">${seat.student}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Room</span>
                            <span class="detail-value">${hallName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Seat No</span>
                            <span class="detail-value">${seatNumber}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Block</span>
                            <span class="detail-value">${block}</span>
                        </div>
                       
                    </div>
                    
                   <div class="hall-title" style="font-weight: bold; color: darkred;">${hallName} Hall Seating Plan: ${block} Block</div>
                `;

                // Build seat grid with corrected logic
                let gridHTML = `<div class="seat-grid" style="grid-template-columns: repeat(${maxCol}, 1fr);">`;

                // Adjust logic for rendering the seats
                for (let i = 0; i < maxRow; i++) {
                    for (let j = 0; j < maxCol; j++) {
                        let seatMatch = null;
                        let currentSeatNumber = "";

                        // Find seat at this position
                        for (let key in seats) {
                            if (seats[key].x === i && seats[key].y === j) {
                                seatMatch = seats[key];
                                currentSeatNumber = key;
                                break;
                            }
                        }

                        const isStudent = seatMatch && seatMatch.student.toUpperCase() === name;
                        const isEntrance = (i === entrance[0] && j === 0); // Entrance should be at the left-most side (below first column)

                        let seatClass = "seat";
                        if (isStudent) seatClass += " student-seat";
                        if (!seatMatch) seatClass += " empty-seat";
                        if (isEntrance) seatClass += " entrance-marker";

                        const seatContent = seatMatch ? currentSeatNumber : "Empty";
                        
                        gridHTML += `<div class="${seatClass}">${seatContent}</div>`;
                    }
                }

                gridHTML += "</div>";

                // Set entrance info (entrance icon will be placed here)
                entranceInfoDiv.innerHTML = `
                    <div class="entrance-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="door-icon">
                            <path d="M10 2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h4V4h-4zm6 0h2v16h-2V4z"/>
                        </svg>
                        <span class="entrance-text">Entrance</span>
                    </div>`;

                // Append student details and seat grid to result div
                resultDiv.innerHTML = studentDetails + gridHTML;
                return;
            }
        }
    }

    // If student not found
    if (!found) {
        resultDiv.innerHTML = `
            <div class="not-found">
                <p>Student not found. Please check the name and try again.</p>
            </div>`;
    }
}
