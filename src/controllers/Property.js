const Property = require('../models/Property');
const cloudinary = require('../utils/cloudinary');

// Get all properties
exports.getProperties = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15; // Default to 15 per page
        const skip = (page - 1) * limit;

        const properties = await Property.find()
            .sort({ createdAt: -1 }) // Show latest properties first
            .skip(skip)
            .limit(limit);

        const total = await Property.countDocuments();

        res.json({
            properties,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get single property by ID
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createProperty = async (req, res) => {
    try {
        console.log("📸 Uploaded Files (Raw):", JSON.stringify(req.files, null, 2));
        console.log("📝 Full Request Body:", JSON.stringify(req.body, null, 2));

        // Check if images were uploaded
       // Extract image URLs from Cloudinary response
const imageUrls = [];
if (req.files && req.files.length > 0) {
    for (const file of req.files) {
        console.log("File object keys:", Object.keys(file));
        console.log("File details:", JSON.stringify(file, null, 2));
        
        // Try different properties where Cloudinary might store the URL
        if (file.path) {
            imageUrls.push(file.path);
        } else if (file.secure_url) {
            imageUrls.push(file.secure_url);
        } else if (file.url) {
            imageUrls.push(file.url);
        } else {
            console.warn("Cannot find URL in file object:", file);
        }
    }
}
console.log("Final image URLs:", imageUrls);
        const { title, price, location, description, type, status, geolocation, amenities,geoLocationLink } = req.body;

        // ✅ Parse geolocation (should be JSON)
        let parsedGeolocation = { lat: 0, lng: 0 };
        if (geolocation) {
            try {
                parsedGeolocation = JSON.parse(geolocation);
            } catch (error) {
                return res.status(400).json({ message: "Invalid geolocation format" });
            }
        }

        // ✅ Convert amenities to an array
        const amenitiesArray = amenities ? amenities.split(',') : [];

        // ✅ Create property object
        const newProperty = new Property({
            title,
            price,
            location,
            description,
            type,
            geoLocationLink,
            size: req.body.size || null,
            bedrooms: req.body.bedrooms || null,
            bathrooms: req.body.bathrooms || null,
            parkingSpaces: req.body.parkingSpaces || null,
            yearBuilt: req.body.yearBuilt || null,
            status,
            amenities: amenitiesArray,
            geolocation: parsedGeolocation,
            images: imageUrls
        });

        console.log("✅ Final Property Data Before Save:", JSON.stringify(newProperty, null, 2));

        await newProperty.save();
        res.status(201).json({ message: "Property created successfully", property: newProperty });

    } catch (error) {
        console.error("❌ Error Creating Property:", error.message);
    console.error("❌ Error Stack:", error.stack);
    res.status(500).json({ 
        message: error.message || "An unknown error occurred", 
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
    }
};






// Update a property
exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json({ message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.filterProperties = async (req, res) => {
    try {
        const filters = {};

        // Text-based search
        if (req.query.search) {
            const regex = new RegExp(req.query.search, 'i');
            filters.$or = [
                { title: regex },
                { location: regex },
                { type: regex },
                { status: regex }
            ];
        }

        // Type (e.g., House, Apartment)
        if (req.query.type) {
            const types = req.query.type.split(',');
            filters.type = types.length > 1 ? { $in: types } : types[0];
        }

        // Status (e.g., For Sale, For Rent)
        if (req.query.status) {
            const statuses = req.query.status.split(',');
            filters.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
        }

        // Price filters
        if (req.query.price) {
            const price = Number(req.query.price);
            if (!isNaN(price)) {
                filters.price = price;
            }
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filters.price = {};
            if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
        }

    

        // Bedrooms
        if (req.query.bedrooms) {
            filters.bedrooms = Number(req.query.bedrooms);
        }

        // Bathrooms
        if (req.query.bathrooms) {
            filters.bathrooms = Number(req.query.bathrooms);
        }

        // Parking spaces
        if (req.query.parkingSpaces) {
            filters.parkingSpaces = Number(req.query.parkingSpaces);
        }

        // Year built
        if (req.query.yearBuilt) {
            filters.yearBuilt = Number(req.query.yearBuilt);
        }

        // Amenities (array contains any of the specified ones)
        if (req.query.amenities) {
            const amenitiesArray = req.query.amenities.split(',');
            filters.amenities = { $in: amenitiesArray };
        }

        console.log("Applied Filters:", filters);

        const properties = await Property.find(filters);
        res.json({ properties });

    } catch (error) {
        console.error("Filter Error:", error);
        res.status(500).json({ message: error.message });
    }
};



