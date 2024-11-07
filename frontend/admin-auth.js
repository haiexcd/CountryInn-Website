// Admin Authentication Script

document.addEventListener('DOMContentLoaded', () => {
    const adminLoginButton = document.querySelector('#admin-login-button');
    if (adminLoginButton) {
        adminLoginButton.addEventListener('click', authenticateAdmin);
    }

    if (document.getElementById('room-list')) {
        // Fetch the room data when we are on the admin page
        fetchRooms();
    }
});

function authenticateAdmin() {
    const storedHash = '5f4dcc3b5aa765d61d8327deb882cf99'; // Example MD5 hash for 'password'
    let password = prompt("Enter Admin Password:");

    if (md5(password) === storedHash) {
        location.href = 'admin.html';
    } else {
        alert("Incorrect password. Access denied.");
    }
}

function md5(string) {
    return CryptoJS.MD5(string).toString();
}

// Fetch all rooms and display them on the admin page
async function fetchRooms() {
    try {
        const response = await fetch('http://localhost:5001/api/rooms');
        const rooms = await response.json();
        displayRooms(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
}

function displayRooms(rooms) {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';

    rooms.forEach(room => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';
        roomDiv.innerHTML = `
            <h3>Room ${room.roomNumber} - ${room.type} - $${room.price}/night</h3>
            <p>Status: ${room.isAvailable ? 'Available' : 'Checked In'}</p>
            ${room.isAvailable ? '' : `<p>Checked in at: ${new Date(room.checkedInAt).toLocaleString()}</p>`}
            <button onclick="${room.isAvailable ? `checkInRoom('${room._id}')` : `checkOutRoom('${room._id}')`}">${room.isAvailable ? 'Check In' : 'Check Out'}</button>
        `;
        roomList.appendChild(roomDiv);
    });
}

// Check in a room by making a POST request to the backend
async function checkInRoom(roomId) {
    try {
        const response = await fetch(`http://localhost:5001/api/rooms/checkin/${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        alert(result.message);
        fetchRooms(); // Refresh the room list after checking in
    } catch (error) {
        console.error('Error checking in room:', error);
    }
}

// Check out a room by making a POST request to the backend
async function checkOutRoom(roomId) {
    try {
        const response = await fetch(`http://localhost:5001/api/rooms/checkout/${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        alert(result.message);
        fetchRooms(); // Refresh the room list after checking out
    } catch (error) {
        console.error('Error checking out room:', error);
    }
}
