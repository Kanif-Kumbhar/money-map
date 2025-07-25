"use client"

import { AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';
import { DeleteTransaction } from '../actions/deleteTransaction';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
}

function DeleteTransactionDialog({open, setOpen, transactionId}: Props) {
  const queryClient = useQueryClient();
	const deleteMutation = useMutation({
		mutationFn: DeleteTransaction,
		onSuccess: async () => {
			toast.success("Transaction deleted successfully", {
				id: transactionId,
			});

			await queryClient.invalidateQueries({
				queryKey: ["transactions"],
			});
		},
		onError: (error) => {
			toast.error(`Failed to delete category: ${error.message}`, {
				id: transactionId,
			});
		},
	});

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						transaction.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							toast.loading("Deleting Transaction...", {
								id: transactionId,
							});
							deleteMutation.mutate(transactionId);
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteTransactionDialog
