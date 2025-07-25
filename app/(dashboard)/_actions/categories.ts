"use server";

import prisma from "@/lib/prisma";
import {
	CreateCategorySchema,
	CreateCategorySchemaType,
	DeleteCategorySchema,
	DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
	const parsedBody = CreateCategorySchema.safeParse(form);
	if (!parsedBody.success) {
		throw new Error("Bad request: " + parsedBody.error.message);
	}

	const user = await currentUser();
	if (!user) {
		redirect("/sign-in");
	}

	const { name, icon, type } = parsedBody.data;
	try {
		return await prisma.category.create({
			data: {
				name,
				icon,
				type,
				userId: user.id,
			},
		});
	} catch (err) {
		console.error("Failed to create category:", err);
		throw new Error("Something went wrong while creating category");
	}
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
	const parsedBody = DeleteCategorySchema.safeParse(form);
	if (!parsedBody.success) {
		throw new Error("Bad request: " + parsedBody.error.message);
	}

	const user = await currentUser();
	if (!user) {
		redirect("/sign-in");
	}

	return await prisma.category.delete({
		where: {
			name_userId_type: {
				userId: user.id,
				name: parsedBody.data.name,
				type: parsedBody.data.type,
			},
		},
	});
}