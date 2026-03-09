import { ProductCreateDTOSchema } from "@/schema";
import prisma from "../prisma";
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { INVENTORY_URL } from "@/config";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body
    const parsedBody = ProductCreateDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: parsedBody.data.sku,
      },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with the same SKU already exists" });
    }

    // Create Inventory
    const product = await prisma.product.create({
      data: parsedBody.data,
    });
    console.log("Product created", product.id);

    // Create inventory record for the product
    const { data: inventory } = await axios.post(
      `${INVENTORY_URL}/inventories`,
      {
        productId: product.id,
        sku: product.sku,
      },
      {
        headers: {
          origin: "http://localhost:8081",
        },
      }
    );

    console.log("Inventory created successfully", inventory.id);

    // update product and store inventory id
    await prisma.product.update({
      where: { id: product.id },
      data: {
        inventoryId: inventory.id,
      },
    });
    console.log("Product updated successfully with inventory");

    return res.status(201).json({ ...product, inventoryId: inventory.id });
  } catch (err) {
    next(err);
  }
};

export default createProduct;
