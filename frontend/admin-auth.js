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
        const response = await fetch('https://countryinn-website-backend.onrender.com/api/rooms');
        const rooms = await response.json();
        displayRooms(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
}

function groupRoomsByBuilding(rooms) {
    const groupedRooms = {
        leftBuilding: [],
        centerBuilding: [],
        officeBuilding: []
    };

    rooms.forEach(room => {
        if (room.roomNumber >= 10 && room.roomNumber <= 21) {
            groupedRooms.leftBuilding.push(room);
        } else if (room.roomNumber >= 35 && room.roomNumber <= 50) {
            groupedRooms.centerBuilding.push(room);
        } else if (room.roomNumber >= 51 && room.roomNumber <= 62) {
            groupedRooms.officeBuilding.push(room);
        }
    });

    return groupedRooms;
}

function displayRooms(rooms) {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';

    const groupedRooms = groupRoomsByBuilding(rooms);

    function renderBuildingRooms(buildingName, rooms) {
        const buildingDiv = document.createElement('div');
        buildingDiv.className = 'building';
        buildingDiv.innerHTML = `<h2>${buildingName}</h2>`;
        rooms.forEach(room => {
            const roomDiv = document.createElement('div');
            roomDiv.className = 'room';
            roomDiv.innerHTML = `
                <h3>Room ${room.roomNumber} - ${room.type} - $${room.price}/night</h3>
                <p>Status: ${room.isAvailable ? 'Available' : 'Checked In'}</p>
                ${room.isAvailable ? '' : `<p>Checked in at: ${new Date(room.checkedInAt).toLocaleString()}</p>`}
                <button onclick="${room.isAvailable ? `checkInRoom('${room._id}')` : `checkOutRoom('${room._id}')`}">${room.isAvailable ? 'Check In' : 'Check Out'}</button>
            `;
            buildingDiv.appendChild(roomDiv);
        });
        roomList.appendChild(buildingDiv);
    }

    renderBuildingRooms('Left Building', groupedRooms.leftBuilding);
    renderBuildingRooms('Center Building', groupedRooms.centerBuilding);
    renderBuildingRooms('Office Building', groupedRooms.officeBuilding);
}

// Check in a room by making a POST request to the backend
async function checkInRoom(roomId) {
    try {
        const response = await fetch(`https://countryinn-website-backend.onrender.com/api/rooms/checkin/${roomId}`, {
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
        const response = await fetch(`https://countryinn-website-backend.onrender.com/api/rooms/checkout/${roomId}`, {
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
