"use client"
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import TransactionTable from './_components/TransactionTable';

function TransactionPage() {

    const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
        from: startOfMonth(new Date()),
        to: new Date(),
    })

  return (
		<>
			<div className="border-b bg-card">
				<div className="conatiner flex flex-wrap items-center justify-between gap-6 py-6 px-3">
					<div>
						<p className="text-3xl font-bold">Transaction History</p>
					</div>
					<DateRangePicker
						initialDateFrom={dateRange.from}
						initialDateTo={dateRange.to}
						showCompare={false}
						onUpdate={(values) => {
							const { from, to } = values.range;
							//we update the date range only if both date are set
							if (!from || !to) return;
							if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
								toast.error(
									`The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days.`
								);
								return;
							}
							setDateRange({ from, to });
						}}
					/>
				</div>
			</div>
            <div className="container px-4">
                <TransactionTable from={dateRange.from} to={dateRange.to}/>
            </div>
		</>
	);
}

export default TransactionPage;
