document.addEventListener("DOMContentLoaded", () => {
    // Initial property fetch (all properties)
    fetchProperties();

    // Search Functionality
    document.getElementById("searchBtn").addEventListener("click", () => {
        const query = document.getElementById("searchInput").value.trim();
        // Call API with search parameter
        fetchProperties({ search: query });
    });

    // Allow "Enter" key to trigger search
    document.getElementById("searchInput").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            document.getElementById("searchBtn").click();
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenu) {
        mobileMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains("active") && 
            !event.target.closest('.navbar') && 
            event.target !== mobileMenu) {
            navLinks.classList.remove("active");
        }
    });

    // Filter Dropdown Toggle
    const filterBtn = document.getElementById('filterBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterClose = document.getElementById('filterClose');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.classList.toggle('active');
        });
    }
    
    // Close button functionality
    if (filterClose) {
        filterClose.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.classList.remove('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        if (filterDropdown) {
            filterDropdown.classList.remove('active');
        }
    });
    
    // Prevent dropdown from closing when clicking inside it
    if (filterDropdown) {
        filterDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Apply filters - using the API endpoint
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            // Get all filter values
            const status = document.getElementById('status').value;
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            const bedrooms = document.getElementById('bedrooms').value;
            const bathrooms = document.getElementById('bathrooms').value;
            const parkingSpaces = document.getElementById('parkingSpaces').value;
            const propertyType = document.getElementById('propertyType').value;
            const amenityCheckboxes = document.querySelectorAll('.amenity:checked');
            const amenities = Array.from(amenityCheckboxes).map(cb => cb.value);
            const search = document.getElementById('searchInput')?.value || '';
            
            console.log("Applying filters via API...");
            console.log("Selected Filters:", {
                search,
                status,
                minPrice,
                maxPrice,
                bedrooms,
                bathrooms,
                parkingSpaces,
                type: propertyType,
                amenities,
            });
            
            // Call API with filter parameters
            fetchProperties({
                search,
                minPrice,
                maxPrice,
                bedrooms,
                bathrooms,
                parkingSpaces,
                type: propertyType,
                status,
                amenities: amenities.join(',')
            });
            
            
            // Close the dropdown
            filterDropdown.classList.remove('active');
        });
    }
    
    // Reset filters
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            if (document.getElementById('status')) document.getElementById('status').value = '';
            if (document.getElementById('minPrice')) document.getElementById('minPrice').value = '';
            if (document.getElementById('maxPrice')) document.getElementById('maxPrice').value = '';
            if (document.getElementById('bedrooms')) document.getElementById('bedrooms').value = '';
            if (document.getElementById('bathrooms')) document.getElementById('bathrooms').value = '';
            if (document.getElementById('parkingSpaces')) document.getElementById('parkingSpaces').value = '';
            if (document.getElementById('propertyType')) document.getElementById('propertyType').value = '';
            if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
            
            console.log("Filters reset - showing all properties");
            // Fetch all properties without filters
            fetchProperties();
        });
    }
});

// Fetch Properties with filter parameters
async function fetchProperties(filterParams = {}) {
    try {
        // Build query string from filter parameters
        const queryParams = new URLSearchParams();
        
        // Add all non-empty parameters to the query
        for (const [key, value] of Object.entries(filterParams)) {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        }
        
        // Build URL with query parameters
        const queryString = queryParams.toString();
        let url = "https://sacbackend.onrender.com/api/properties";
        
        if (queryString) {
            url = `https://sacbackend.onrender.com/api/properties/filter?${queryString}`;
        }
        
        console.log("Fetching from:", url);
        
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched Data:", data);

        if (!data.properties || !Array.isArray(data.properties)) {
            console.error("❌ Invalid properties data:", data);
            return;
        }
        
        displayProperties(data.properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        
        // Show error message to user
        const container = document.getElementById("property-list");
        if (container) {
            container.innerHTML = "<p class='error-message'>Error loading properties. Please try again later.</p>";
        }
    }
}

// Display Properties
function displayProperties(properties) {
    const container = document.getElementById("property-list");
    const noResults = document.getElementById("no-results");
    
    container.innerHTML = "";

    if (properties.length === 0) {
        // Show the no results message
        if (noResults) {
            noResults.style.display = "block";
        } else {
            container.innerHTML = "<p>No properties found.</p>";
        }
        return;
    } else {
        // Hide the no results message if it exists
        if (noResults) {
            noResults.style.display = "none";
        }
    }
    
    properties.forEach(property => {
        const propertyCard = document.createElement("div");
        propertyCard.classList.add("property-card");
        
        // Using the exact same display format as your original code
        let imageSrc;
        if (property.images && property.images.length > 0) {
            imageSrc = property.images[0];
        } else if (property.image) {
            imageSrc = property.image;
        } else {
            imageSrc = 'https://via.placeholder.com/300';
        }

        propertyCard.innerHTML = `
            <img src="${imageSrc}" alt="Property Image">
            <div class="details">
                <h3>${property.title}</h3>
                <p>${property.location || "Location not specified"}</p>
                <p class="price">₦${property.price.toLocaleString()}</p>
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