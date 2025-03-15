document.addEventListener("DOMContentLoaded", () => {
    fetchProperties();

    // Search Functionality
    document.getElementById("searchBtn").addEventListener("click", () => {
        const query = document.getElementById("searchInput").value.trim();
        fetchProperties(query);
    });

    // Allow "Enter" key to trigger search
    document.getElementById("searchInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            document.getElementById("searchBtn").click();
        }
    });

    // Mobile Menu Toggle - Enhanced version
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenu) {
        mobileMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains("active") && 
            !event.target.closest('.navbar') && 
            event.target !== mobileMenu) {
            navLinks.classList.remove("active");
        }
    });
});

// Fetch Properties
async function fetchProperties(searchQuery = "") {
    try {
        let url = "http://localhost:5000/api/properties";

        if (searchQuery) {
            url = `http://localhost:5000/api/properties/filter?title=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched Data:", data);  // 🔍 Debugging Line

        if (!data.properties || !Array.isArray(data.properties)) {
            console.error("❌ Invalid properties data:", data);
            return;
        }
        displayProperties(data.properties);
        

    } catch (error) {
        console.error("Error fetching properties:", error);
    }
}

// Display Properties
function displayProperties(properties) {
    const container = document.getElementById("property-list");
    container.innerHTML = "";

    if (properties.length === 0) {
        container.innerHTML = "<p>No properties found.</p>";
        return;
    }
    properties.forEach(property => {
        const propertyCard = document.createElement("div");
        propertyCard.classList.add("property-card");

        propertyCard.innerHTML = `
            <img src="${property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/300'}" alt="Property Image">
            <div class="details">
                <h3>${property.title}</h3>
                <p>${property.location || "Location not specified"}</p>
                <p class="price">$${property.price.toLocaleString()}</p>
            </div>
        `;

        // Add click event to view property details
        propertyCard.addEventListener("click", () => {
            viewProperty(property._id);
        });

        container.appendChild(propertyCard);
    });
}

function viewProperty(id) {
    window.location.href = `property-details.html?id=${id}`;
}