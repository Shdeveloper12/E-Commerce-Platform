import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, components, totalPrice } = body;

    if (!name || !components || components.length === 0) {
      return NextResponse.json(
        { error: "Invalid build data" },
        { status: 400 }
      );
    }

    // Create PC build
    const build = await db.pCBuild.create({
      data: {
        userId: session.user.id,
        name,
        totalPrice,
        isPublic: false,
        components: {
          create: components.map((comp: any) => ({
            componentType: comp.componentType,
            productId: comp.productId,
          })),
        },
      },
      include: {
        components: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      build: {
        id: build.id,
        name: build.name,
        totalPrice: build.totalPrice,
      }
    });
  } catch (error) {
    console.error("Error saving PC build:", error);
    return NextResponse.json(
      { error: "Failed to save build" },
      { status: 500 }
    );
  }
}
