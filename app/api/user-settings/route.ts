import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
	const user = await currentUser();

	if (!user) {
		redirect("/sign-in");
	}

	let userSettings = await prisma.userSettings.findUnique({
		where: {
			userId: user.id,
		},
	});

	// ❗ Create settings only if not found
	if (!userSettings) {
		userSettings = await prisma.userSettings.create({
			data: {
				userId: user.id,
				currency: "USD",
			},
		});
	}

	// Revalidate page that depends on this setting
	revalidatePath("/");

	return Response.json(userSettings);
}