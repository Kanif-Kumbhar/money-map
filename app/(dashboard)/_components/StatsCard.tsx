"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { UserSettings } from "@/lib/generated/prisma/client";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
	userSettings: UserSettings;
	from: Date;
	to: Date;
}

function StatsCard({ from, to, userSettings }: Props) {
	const statsQuery = useQuery<GetBalanceStatsResponseType>({
		queryKey: ["overview", "stats", from, to],
		queryFn: () =>
			fetch(
				`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
			).then((res) => res.json()),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(userSettings.currency);
	}, [userSettings.currency]);

	const income = statsQuery.data?.income || 0;
	const expense = statsQuery.data?.expense || 0;
	const balance = income - expense;

	return (
		<div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
			<SkeletonWrapper isLoading={statsQuery.isFetching}>
				<StatCard
					formatter={formatter}
					value={income}
					title="Income"
					icon={
						<TrendingUp className="h-10 w-10 rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
					}
					color="text-emerald-500"
				/>
			</SkeletonWrapper>

			<SkeletonWrapper isLoading={statsQuery.isFetching}>
				<StatCard
					formatter={formatter}
					value={expense}
					title="Expense"
					icon={
						<TrendingDown className="h-10 w-10 rounded-lg p-2 text-rose-500 bg-rose-400/10" />
					}
					color="text-rose-500"
				/>
			</SkeletonWrapper>

			<SkeletonWrapper isLoading={statsQuery.isFetching}>
				<StatCard
					formatter={formatter}
					value={balance}
					title="Balance"
					icon={
						<Wallet className="h-10 w-10 rounded-lg p-2 text-blue-500 bg-blue-400/10" />
					}
					color="text-blue-500"
				/>
			</SkeletonWrapper>
		</div>
	);
}

export default StatsCard;

function StatCard({
	formatter,
	value,
	title,
	icon,
	color,
}: {
	formatter: Intl.NumberFormat;
	value: number;
	title: string;
	icon: React.ReactNode;
	color: string;
}) {
	const formatFn = useCallback(
		(value: number) => {
			return formatter.format(value);
		},
		[formatter]
	);

	return (
		<Card className="flex h-24 w-full items-center p-4">
			<div className="flex items-center gap-4 w-full">
				<div className="flex-shrink-0">{icon}</div>
				<div className="flex flex-col">
					<p className="text-sm text-muted-foreground">{title}</p>
					<CountUp
						preserveValue
						redraw={false}
						end={value}
						decimals={2}
						formattingFn={formatFn}
						className={`text-xl font-semibold ${color}`}
					/>
				</div>
			</div>
		</Card>
	);
}
