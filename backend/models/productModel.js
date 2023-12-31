import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"]
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: [true, "Please Enter the category"]
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    reviews: [
        {
            user: {
                type: Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true

            },
            rating: {
                type: Number,
                required: true

            },
            comment: {
                type: String,
                required: true

            }

        }
    ],
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },

}, {
    timestamps: true
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
