export const Currencies = [
	{ value: "USD", label: "$ Dollar", locale: "en-US" },
	{ value: "EUR", label: "€ Euro", locale: "de-DE" },
	{ value: "INR", label: "₹ Indian Rupee", locale: "en-IN" },
	{ value: "GBP", label: "£ British Pound", locale: "en-GB" },
	{ value: "JPY", label: "¥ Japanese Yen", locale: "ja-JP" },
	{ value: "CNY", label: "¥ Chinese Yuan", locale: "zh-CN" },
	{ value: "CAD", label: "$ Canadian Dollar", locale: "en-CA" },
	{ value: "AUD", label: "$ Australian Dollar", locale: "en-AU" },
	{ value: "CHF", label: "CHF Swiss Franc", locale: "de-CH" },
	{ value: "ZAR", label: "R South African Rand", locale: "en-ZA" },
	{ value: "BRL", label: "R$ Brazilian Real", locale: "pt-BR" },
	{ value: "RUB", label: "₽ Russian Ruble", locale: "ru-RU" },
	{ value: "KRW", label: "₩ South Korean Won", locale: "ko-KR" },
	{ value: "SGD", label: "$ Singapore Dollar", locale: "en-SG" },
	{ value: "AED", label: "د.إ UAE Dirham", locale: "ar-AE" },
];

export type Currency = (typeof Currencies)[0];