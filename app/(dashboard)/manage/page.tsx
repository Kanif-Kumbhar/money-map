"use client"

import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'
import CreateCategoryDialog from '../_components/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/generated/prisma';
import DeleteCategoryDialog from '@/app/(dashboard)/_components/DeleteCategoryDialog';

function page() {
  return (
		<>
			{/* HEADER */}
			<div className="border-b bg-card">
				<div className="container flex flex-wrap items-center justify-between gap-6 py-6 pl-4 md:pl-10">
					<div>
						<p className="text-xl font-bold">Manage</p>
						<p className="text-muted-foreground">
							Manage your account setting and preferences here.
						</p>
					</div>
				</div>
			</div>

			<div className="container flex flex-col gap-4 p-4">
				<Card>
					<CardHeader>
						<CardTitle>Currency</CardTitle>
						<CardDescription>
							Set your preferred currency for transactions.
						</CardDescription>
					</CardHeader>
                    <CardContent>
                        <CurrencyComboBox/>
                    </CardContent>
				</Card>
                <CategoryList type="income"/>
                <CategoryList type="expense"/>
			</div>
		</>
	);
}

export default page

function CategoryList({ type }: { type: TransactionType}) {
    const categoryQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () =>
            fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    })

	const dataAvailable = categoryQuery.data && categoryQuery.data.length > 0;

    return (
			<SkeletonWrapper isLoading={categoryQuery.isLoading}>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								{type === "expense" ? (
									<TrendingDown className="h-12 w-12 items-center rounded-lg bg-rose-400/10 text-rose-500" />
								) : (
									<TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 text-emerald-500" />
								)}
								<div>
									{type === "income" ? "Income" : "Expense"} Categories
									<div className="text-sm text-muted-foreground">
										Sorted by name
									</div>
								</div>
							</div>
							<CreateCategoryDialog
								type={type}
								successCallback={() => categoryQuery.refetch()}
								trigger= { 
									<Button className={"gap-2 text-sm"}>
										<PlusSquare className="h-4 w-4" />
										Create Category
									</Button>
								}
							/>
						</CardTitle>
					</CardHeader>
					<Separator/>
				{ !dataAvailable && (
					<div className="flex h-40 w-full flex-col items-center justify-center">
						<p>
							No{""}
							<span className={cn(
								"m-1",
								type === "income" ? "text-emerald-500" : "text-rose-500"
							)}>{type}</span>categories yet.
						</p>
						<p className="text-sm text-muted-foreground">
							Create a new category to get started.
						</p>
					</div>
				)}
				{dataAvailable && (
					<div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{categoryQuery.data.map((category : Category) => (
							<CategoryCard category={category} key={category.name}/>
						))}
					</div>
				)}
				</Card>
			</SkeletonWrapper>
		);
}

function CategoryCard({category} : {category : Category}){
	return (
		<div className="flex border-separate flex-col justify-between rounded-md border shadow-black/[0.1] dark:shadow-white/[0.1]">
			<div className="flex flex-col items-center gap-2 p-4">
				<span className="text-3xl" role="img">
					{category.icon}
				</span>
				<span>{category.name}</span>
			</div>
			<DeleteCategoryDialog
				category={category}
				trigger={
					<Button
						className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500.20"
						variant={"secondary"}
					>
						<TrashIcon className="h-4 w-4" />
						Remove
					</Button>
				}
			/>
		</div>
	);
}