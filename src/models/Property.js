const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String,  },         // Property name
    price: { type: Number,  },        // Price of the property
    location: { type: String,  },     // Address or general location
    description: { type: String },                  // Detailed description
    type: { type: String,  enum: ['House', 'Apartment', 'Land', 'Commercial'] }, // Property Type
    size: { type: Number,  },         // Size in square feet/meters
    bedrooms: { type: Number,  },     // Number of bedrooms
    bathrooms: { type: Number,  },    // Number of bathrooms
    parkingSpaces: { type: Number, default: 0 },    // Parking spaces available
    yearBuilt: { type: Number },                    // Year the property was built
    status: { type: String, enum: ['For Sale', 'For Rent', 'Sold'], default: 'For Sale' }, // Availability
    images: { type: [String] },                     // Array of image URLs
    amenities: { type: [String] },                  // List of amenities (pool, gym, etc.)
    geolocation: {                                   // Geolocation for maps
        lat: { type: Number, },      // Latitude
        lng: { type: Number,  }       // Longitude
    },
    geoLocationLink: {
        type:String
    },
    createdAt: { type: Date, default: Date.now }    // Timestamp
});

module.exports = mongoose.model('Property', PropertySchema);
