import Logo from "@/components/Logo";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex h-screen w-full flex-col items-center justify-center">
			<Logo />
			<div className="">{children}</div>
		</div>
	);
}

export default layout;
