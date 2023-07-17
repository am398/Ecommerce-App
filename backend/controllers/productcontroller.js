exports.getallproducts = (req, res, next) => {
    const products = [
        {
            id: 'p1',
            title: 'Red Shirt',
            description: 'A red shirt - it is pretty red!',
            price: 29.99,
        },
    ];
    res.status(200).json({ products: products });
}
