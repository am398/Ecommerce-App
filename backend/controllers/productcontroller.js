import Product from "../models/productModel.js"
import Errorhandler from "../utils/errorHandler.js";


//-Admin
const createproduct = async (req, res, next) => {

    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
}
//get all products
const getallproducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products: products });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
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
        res.status(400).json({ success: false, error: error });
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
            res.status(400).json({ success: false, error: error });
        }
    }

}

const getSingleProduct = async (req, res, next) => {
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

export { getallproducts, createproduct, updateProduct, deleteProduct, getSingleProduct };
