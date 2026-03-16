require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const connectDB = require('../src/config/db');

const products = [
    {
        name: 'Nike React Vision Black/Blue',
        price: 160,
        description: 'Designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.',
        category: 'Running',
        stock: 50,
        sku: 'NKE-REA',
        image: 'nike-react-vision.jpg'
    },
    {
        name: 'Nike Air Max Plus TN Gradient Blue',
        price: 180,
        description: 'The Nike Air Max Plus TN offers a Tuned Air experience that offers premium stability and unbelievable cushioning.',
        category: 'Casual',
        stock: 30,
        sku: 'NKE-TNP',
        image: 'nike-tn.jpg'
    },
    {
        name: 'Nike Air Force 1 Custom Drip',
        price: 120,
        description: 'The radiance lives on in the Nike Air Force 1 \'07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash to make you shine.',
        category: 'Casual',
        stock: 100,
        sku: 'NKE-AF1',
        image: 'custom-af1.jpg'
    }
];

const seedProducts = async () => {
    try {
        await connectDB();

        // Check if products already exist to avoid duplicates (optional, based on SKU)
        for (const product of products) {
            const exists = await Product.findOne({ sku: product.sku });
            if (exists) {
                console.log(`Product ${product.name} already exists. Updating...`);
                await Product.findOneAndUpdate({ sku: product.sku }, product);
            } else {
                console.log(`Creating product ${product.name}...`);
                await Product.create(product);
            }
        }

        console.log('Products seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
