import { Category } from "@/lib/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { DeleteCategory } from "@/app/(dashboard)/_actions/categories";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TransactionType } from "@/lib/types";

interface Props { 
    trigger: ReactNode;
    category: Category;
}

function DeleteCategoryDialog({ category, trigger }: Props) {

    const categoryIdentifier = `${category.name}-${category.type}`;
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success("Category deleted successfully",{
                id: categoryIdentifier
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories", category.type],
            })
        },
        onError: (error) => {
            toast.error(`Failed to delete category: ${error.message}`, {
                id: categoryIdentifier
            });
        }
    })

    return (
			<AlertDialog>
				<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your category
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick = {() => {
                                toast.loading("Deleting category...", {
                                    id: categoryIdentifier,
                                });
                                deleteMutation.mutate({
                                    name: category.name,
                                    type: category.type as TransactionType,
                                })
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
			</AlertDialog>
		);
}

export default DeleteCategoryDialog;