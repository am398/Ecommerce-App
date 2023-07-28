import Product from "../models/productModel.js"
import Errorhandler from "../utils/errorHandler.js";
import Apifeatures from "../utils/apifeatures.js";


//-Admin
const createproduct = async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
//get all products
const getallproducts = async (req, res, next) => {
    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();
    try {
        const apifeatures = new Apifeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resultsPerPage);
        const products = await apifeatures.query;
        const Count = Object.keys(products).length;
        res.status(200).json({ success: true, products: products, AllProducts: productCount, Count: Count });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

//admin

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        const query = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, query });

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

const deleteProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            const error = new Errorhandler("Product not found", 404);
            throw error;
        }
        await Product.deleteOne({ _id: req.params.id }).then((message) => res.status(200).json({ success: true, message: message }));
    }
    catch (error) {
        if (error instanceof Errorhandler) {
            console.log(error);
            // Handle the specific Errorhandler error
            next(error);
        } else {
            console.log(error);
            res.status(400).json({ success: false, error: error.message });
        }
    }

}

const getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            const error = new Errorhandler("Product not found", 404);
            throw error;
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        // if (error instanceof Errorhandler) {
        //     console.log(error);
        // Handle the specific Errorhandler error
        next(error);
        // } else {
        //     console.log(error);
        //     res.status(400).json({ success: false, error });
        // }
    }
};

// Create New Review or Update the review
const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            (rev) => 
            {
                return rev.user.toString() === req.user._id.toString()
            }
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });
        } else {
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
        }

        let sum = 0;

        product.reviews.forEach((rev) => {
            sum += rev.rating;
        });

        product.rating = sum / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        return next(error);
    }
};

// Get All Reviews of a product
const getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);

        if (!product) {
            return next(new Errorhandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });
    }
    catch (error) {
        next(error);
    }
};

// Delete Review
const deleteReview = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return next(new Errorhandler("Product not found", 404));
        }

        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;

        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        let ratings = 0;

        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = avg / reviews.length;
        }

        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
};




export { getallproducts, createproduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview };
