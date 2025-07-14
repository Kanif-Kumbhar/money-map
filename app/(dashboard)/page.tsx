import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";

async function page() {
	const user = await currentUser();
	if (!user) {
		redirect("/sign-in");
	}

	const userSettings = await prisma.userSettings.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (!userSettings) {
		redirect("/wizard");
	}

	function capitalizeFirstLetter(name: string) {
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

	return (
		<div className="h-full bg-background">
			<div className="border-b bg-card container px-4 py-6 md:px-6">
				<div className="container flex flex-wrap items-center justify-between gap-6 ">
					<p className="text-3xl font-bold">
						Hello,{" "}
						{capitalizeFirstLetter(user.firstName ?? user.username ?? "User")}
						!👋
					</p>
					<div className="flex items-center gap-3">
						<CreateTransactionDialog
							trigger={
								<Button className="border border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white">
									New Income
								</Button>
							}
							type="income"
						/>

						<CreateTransactionDialog
							trigger={
								<Button className="border border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white">
									New Expense
								</Button>
							}
							type="expense"
						/>
					</div>
				</div>
			</div>
			<div className="container px-4 md:px-6">
				<Overview userSettings={userSettings} />
			</div>
		</div>
	);
}

export default page;
