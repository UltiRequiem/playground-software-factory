import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(request) {
  try {
    const db = await open({
      filename: "store.db",
      driver: sqlite3.Database,
    });

    const products = await db.all("SELECT * FROM products");

    await db.close();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, image_url } = body;

    const db = await open({
      filename: "store.db",
      driver: sqlite3.Database,
    });

    const result = await db.run(
      "INSERT INTO products (name, description, image_url) VALUES (?, ?, ?)",
      [name, description, image_url]
    );

    await db.close();

    return NextResponse.json(
      { message: "Producto creado", productId: result.lastID },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear producto", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID del producto es requerido" },
        { status: 400 }
      );
    }

    const db = await open({
      filename: "store.db",
      driver: sqlite3.Database,
    });

    const result = await db.run("DELETE FROM products WHERE id = ?", [id]);

    await db.close();

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Producto eliminado" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar producto", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const { name, description, image_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID del producto es requerido" },
        { status: 400 }
      );
    }

    const db = await open({
      filename: "store.db",
      driver: sqlite3.Database,
    });

    const result = await db.run(
      "UPDATE products SET name = ?, description = ?, image_url = ? WHERE id = ?",
      [name, description, image_url, id]
    );

    await db.close();

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Producto actualizado" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar producto", details: error.message },
      { status: 500 }
    );
  }
}
