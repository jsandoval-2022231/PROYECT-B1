import { response, request } from "express";
import Product from '../product/product.model.js';
import Category from '../category/category.model.js';
import Bill from './bill.model.js';
import mongoose from "mongoose";
import Cart from '../cart/cart.model.js';

export const getBill = async (req = request, res = response) => {
    const query = { status: "PAID" };

    const [total, bills] = await Promise.all([
        Bill.countDocuments(query),
        Bill.find(query)
            .populate('customer', 'name')
            .populate('products', 'name')
    ]);

    res.status(200).json({ total, bills });
}

// TEST 1
// export const getBillByCustomer = async (req = request, res = response) => {
//     const { id } = req.params;
//     console.log(id);

//     const bill = await Bill.findOne({ customer: id })
//             .populate('customer', 'name') 
//             .populate('products', 'name');

//     res.status(200).json({ bill });

// }

export const getBillByCustomer = async (req, res) => {
    const { id } = req.params;
    const query = { customer: id };
    
    console.log(id);
    const [total, bills] = await Promise.all([
        Bill.countDocuments(query),
        Bill.find(query)
            .populate('customer', 'name')
            .populate('products', 'name')
    ]);

    res.status(200).json({ total, bills });
}


// test create bill with cart validation for stock

export const createBillWithCart = async (req, res) => {
    const customer = req.user._id;
    const cart = await Cart.findOne({ customer }).populate('products.product');
    if (!cart) {
        return res.status(400).json({ msg: "You don't have a cart" });
    }

    const productsToCheck = cart.products.map(({ product, quantity }) => ({
        products: [ product._id, quantity ],
        stock: product.stock
    }));

    const insufficientStockProducts = productsToCheck.filter(({ stock, quantity }) => stock < quantity);
    if (insufficientStockProducts.length > 0) {
        return res.status(400).json({ msg: "Insufficient stock for some products", insufficientStockProducts });
    }

    const products = cart.products.map(({ product, quantity }) => ({ product: product._id, quantity }));
    const bill = new Bill({ customer, products });
    await bill.save();
    
    // Update stock after creating bill
    for (const { product, quantity } of cart.products) {
        product.stock -= quantity;
        await product.save();
    }

    cart.products = [];
    await cart.save();
    res.status(201).json({ msg: "Bill created successfully", bill });
}


// test create bill with cart

// export const createBillWithCart = async (req, res) => {
//     const customer = req.user._id;
//     const cart = await Cart.findOne({ customer });
//     if (!cart) {
//         return res.status(400).json({ msg: "You don't have a cart" });
//     }

//     const products = cart.products.map(({ product, quantity }) => ({ product: product, quantity }));
//     const bill = new Bill({ customer, products });
//     await bill.save();
//     cart.products = [];
//     await cart.save();
//     res.status(201).json({ msg: "Bill created successfully", bill });
// }



// TEST CREATE BILL WITH VALIDATION FOR STOCK

// export const createBill = async (req, res) => {
//     try {
//         const customer = req.user._id;
//         const cart = await Cart.findOne({ customer }).populate('products.product');
//         const products = cart.products;

//         for (const { product: productId, quantity } of products) {
//             const product = await Product.findById(productId);
//             if (!product) {
//                 return res.status(404).json({ error: `El producto con el ID ${productId} no se encontró.` });
//             }
        
//             if (product.stock < quantity) {
//                 return res.status(400).json({ error: `No hay suficiente stock para el producto con el ID ${productId}.` });
//             }
//         }
        
//         // Crear la factura
//         const bill = new Bill({ customer: customer, products });
        
//         // Actualizar el stock después de crear la factura
//         for (const { product: productId, quantity } of products) {
//             const product = await Product.findById(productId);
//             product.stock -= quantity;
//             await product.save();
//         }
//     } catch (error) {
//         console.error("Error al crear la factura:", error);
//         res.status(500).json({ error: "Ocurrió un error al procesar la solicitud." });
//     }
// }


// TEST CREATE BILL

// export const createBill = async (req, res) => {
//     const { customer, products, total } = req.body;
//     console.log(req.body);

//     const bill = new Bill({ customer, products, total });

//     await bill.save();

//     res.status(201).json({ bill });
// }

export const payBill = async (req, res) => {
    const { id } = req.params;
    const bill = await Bill.findById(id);

    bill.status = "PAID";
    await bill.save();
    
    res.status(200).json({ 
        msg: "Bill paid successfully, thanks for you purchase", bill });
}

export const updateBill = async (req, res) => {
    const { id } = req.params;
    const { _id, customer, ...rest } = req.body;

    await Bill.findByIdAndUpdate(id, rest);

    const bill = await Bill.findOne({ _id: id });

    res.status(200).json({ 
        msg: "Bill updated successfully",
        bill });
}

