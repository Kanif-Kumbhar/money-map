"use client"

import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CreateCategorySchema, CreateCategorySchemaType } from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@radix-ui/react-dialog';
import { CircleOff, Loader2, PlusSquare } from 'lucide-react';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCategory } from '../_actions/categories';
import { Category } from '@/lib/generated/prisma';
import { toast } from 'sonner';
import { useTheme } from "next-themes";

interface Props {
	type: TransactionType;
	successCallback: (category: Category) => void;
	trigger?: React.ReactNode;
}

function CreateCategoryDialog({ type, successCallback, trigger }: Props) {
	const [open, setOpen] = useState(false);
	const form = useForm<CreateCategorySchemaType>({
		resolver: zodResolver(CreateCategorySchema),
		defaultValues: {
			type,
		},
	});

	const queryClient = useQueryClient();
	const theme = useTheme();

	const { mutate, isPending } = useMutation({
		mutationFn: CreateCategory,
		onSuccess: async (data: Category) => {
			form.reset({
				name: "",
				icon: "",
				type,
			});

			toast.success(`Category ${data.name} created successfully!`, {
				id: "create-category",
			});

			successCallback(data);

			await queryClient.invalidateQueries({
				queryKey: ["categories"],
			});

			setOpen((prev) => !prev);
		},
		onError: (error: Error) => {
			toast.error(error.message, {
				id: "create-category",
			});
		},
	});

	const onSubmit = useCallback(
		(values: CreateCategorySchemaType) => {
			toast.loading("Creating category...", {
				id: "create-category",
			});
			mutate(values);
		},
		[mutate]
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<Button
						variant={"ghost"}
						className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
					>
						<PlusSquare className="mr-2 h-4 w-4" />
						Create New
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>
					Create
					<span
						className={cn(
							"m-1",
							type === "income" ? "text-emerald-500" : "text-red-500"
						)}
					>
						{type}
					</span>
					category
				</DialogTitle>
				<DialogDescription>
					Categories are used to organize your transactions. You can create a
					new category here.
				</DialogDescription>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Category" {...field} />
									</FormControl>
									<FormDescription>
										This will how category will appear in the app
									</FormDescription>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="outline" className="w-full h-[100px]">
													{form.watch("icon") ? (
														<div className="flex flex-col items-center gap-2">
															<span className="text-5xl" role="img">
																{field.value}
															</span>
															<p className="text-xs text-muted-foreground">
																Click to change
															</p>
														</div>
													) : (
														<div className="flex flex-col items-center gap-2">
															<CircleOff className="h-[48px] w-[48px]" />
															<p className="text-xs text-muted-foreground">
																Click to select
															</p>
														</div>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-full">
												<EmojiPicker
													onEmojiClick={(emojiData: EmojiClickData) => {
														field.onChange(emojiData.emoji);
													}}
													emojiStyle={EmojiStyle.NATIVE}
													lazyLoadEmojis={true}
													theme={theme.resolvedTheme as Theme}
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormDescription>
										This is how your category will be displayed in the app.
									</FormDescription>
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="button"
							variant={"secondary"}
							onClick={() => {
								form.reset();
							}}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
						{!isPending && "Create"}
						{isPending && <Loader2 className="animate-spin" />}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default CreateCategoryDialog
