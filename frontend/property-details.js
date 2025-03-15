document.addEventListener("DOMContentLoaded", async () => {
    // Mobile menu toggle
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
            !event.target.closest('nav') && 
            event.target !== mobileMenu) {
            navLinks.classList.remove("active");
        }
    });

    // Get property ID from URL
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get("id");

    if (!propertyId) {
        document.getElementById("property-details").innerHTML = `
            <div class="property-not-found">
                <h2>Property Not Found</h2>
                <p>The property you're looking for doesn't exist or has been removed.</p>
                <a href="index.html" class="back-button">Back to Homepage</a>
            </div>
        `;
        return;
    }

    try {
        // Show loading state
        document.getElementById("property-details").innerHTML = `
            <div class="loading-container">
                <p>Loading property details...</p>
            </div>
        `;
        
        const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`);
        
        if (!response.ok) {
            throw new Error('Property not found');
        }
        
        const property = await response.json();
        displayPropertyDetails(property);
    } catch (error) {
        console.error("Error fetching property details:", error);
        document.getElementById("property-details").innerHTML = `
            <div class="error-container">
                <h2>Something went wrong</h2>
                <p>We couldn't load this property. Please try again later.</p>
                <a href="index.html" class="back-button">Back to Homepage</a>
            </div>
        `;
    }
});

function displayPropertyDetails(property) {
    const container = document.getElementById("property-details");
    
    // Format data nicely - using Naira currency
    const formattedPrice = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
    }).format(property.price);
    
    // Create HTML structure
    let html = `
        <div class="property-header">
            <h2>${property.title}</h2>
            <p class="address">${property.location || "Address not available"}</p>
        </div>
        
        <div class="main-image-container">
            <img id="main-property-image" src="${property.images[0] || 'https://via.placeholder.com/1200x600?text=No+Image+Available'}" alt="${property.title}">
            <div class="price-badge">${formattedPrice}</div>
            
            <div class="image-navigation">
                <button id="prev-image" class="nav-button">&lt;</button>
                <button id="next-image" class="nav-button">&gt;</button>
            </div>
            
            <div class="image-counter">
                <span id="current-image">1</span> / <span id="total-images">${property.images.length}</span>
            </div>
        </div>
        
        <div class="property-content">
            <div class="property-left-column">
                <div class="property-main-info">
                    <div class="property-specs">
                        <div class="spec-item">
                            <p class="spec-value">${property.bedrooms || 0}</p>
                            <p class="spec-label">Bedrooms</p>
                        </div>
                        <div class="spec-item">
                            <p class="spec-value">${property.bathrooms || 0}</p>
                            <p class="spec-label">Bathrooms</p>
                        </div>
                        <div class="spec-item">
                            <p class="spec-value">${property.size ? property.size.toLocaleString() : 'N/A'}</p>
                            <p class="spec-label">Sq Ft</p>
                        </div>
                        <div class="spec-item">
                            <p class="spec-value">${property.yearBuilt || 'N/A'}</p>
                            <p class="spec-label">Year Built</p>
                        </div>
                    </div>
                </div>
                
                <div class="property-description">
                    <h3>About This Property</h3>
                    <p>${property.description || "No description available for this property."}</p>
                </div>
    `;
    
    // Add image gallery if there are multiple images
    if (property.images.length > 1) {
        html += `
            <div class="image-gallery">
                <h3>Property Images</h3>
                <div class="gallery-grid">
        `;
        
        property.images.forEach((image, index) => {
            html += `
                <div class="gallery-item">
                    <img src="${image}" alt="Property Image" data-index="${index}" class="gallery-thumbnail">
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += `</div>`; // Close property-left-column
    
    // Add sidebar
    html += `
        <div class="property-sidebar">
            <div class="sidebar-section">
                <h3>Property Details</h3>
                <p><strong>Type:</strong> ${property.type || 'N/A'}</p>
                <p><strong>Status:</strong> ${property.status || 'N/A'}</p>
                <p><strong>Parking:</strong> ${property.parkingSpaces || 0} spaces</p>
            </div>
    `;
    
    if (property.amenities && property.amenities.length > 0) {
        html += `
            <div class="sidebar-section">
                <h3>Amenities</h3>
                <div class="amenities-list">
        `;
        
        property.amenities.forEach(amenity => {
            html += `<span>${amenity}</span>`;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += `
        </div>
    </div>
    `;
    
    container.innerHTML = html;
    
    // Set up image navigation
    if (property.images.length > 1) {
        let currentImageIndex = 0;
        const totalImages = property.images.length;
        const mainImage = document.getElementById('main-property-image');
        const prevButton = document.getElementById('prev-image');
        const nextButton = document.getElementById('next-image');
        const currentImageCounter = document.getElementById('current-image');
        const totalImagesCounter = document.getElementById('total-images');
        
        // Initialize counters
        currentImageCounter.textContent = '1';
        totalImagesCounter.textContent = totalImages.toString();
        
        // Function to update main image
        function updateMainImage(index) {
            mainImage.src = property.images[index];
            currentImageIndex = index;
            currentImageCounter.textContent = (index + 1).toString();
            
            // Update active thumbnail
            const thumbnails = document.querySelectorAll('.gallery-thumbnail');
            thumbnails.forEach((thumb, idx) => {
                if (idx === index) {
                    thumb.classList.add('active-thumbnail');
                } else {
                    thumb.classList.remove('active-thumbnail');
                }
            });
        }
        
        // Previous button click
        prevButton.addEventListener('click', () => {
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) newIndex = totalImages - 1;
            updateMainImage(newIndex);
        });
        
        // Next button click
        nextButton.addEventListener('click', () => {
            let newIndex = currentImageIndex + 1;
            if (newIndex >= totalImages) newIndex = 0;
            updateMainImage(newIndex);
        });
        
        // Gallery thumbnail click
        const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
        galleryThumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                updateMainImage(index);
            });
        });
        
        // Highlight the first thumbnail
        if (galleryThumbnails.length > 0) {
            galleryThumbnails[0].classList.add('active-thumbnail');
        }
    } else {
        // Hide navigation buttons if there's only one image
        const navButtons = document.querySelector('.image-navigation');
        const imageCounter = document.querySelector('.image-counter');
        if (navButtons) navButtons.style.display = 'none';
        if (imageCounter) imageCounter.style.display = 'none';
    }
}

// Function to show full image modal
function showFullImage(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <img src="${imageSrc}" alt="Full size image">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking the close button
    modal.querySelector('.close-button').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}