import { Dialog } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

import { ThemeToggle } from "~/components/shadcn/ui/theme-toggle"

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<header className="w-full">
			<nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
				<div className="flex lg:flex-1"></div>
				<div className="flex lg:hidden">
					{/* <button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
						onClick={() => setMobileMenuOpen(true)}
					>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button> */}
					<ThemeToggle />
				</div>
				<div className="hidden lg:flex lg:gap-x-12">
					{/* {navigation.map((item) => (
						<a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
							{item.name}
						</a>
					))} */}
				</div>
				<div className="hidden lg:flex lg:flex-1 lg:justify-end">
					<ThemeToggle />
				</div>
			</nav>
			<Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
				<div className="fixed inset-0 z-10" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 dark:bg-slate-900 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
							onClick={() => setMobileMenuOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<XMarkIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-6 flow-root">
						<div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-300/50">
							{/* <div className="space-y-2 py-6">
								{navigation.map((item) => (
									<a
										key={item.name}
										href={item.href}
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>
										{item.name}
									</a>
								))}
							</div> */}
							<div className="flex justify-center py-6">
								<ThemeToggle />
							</div>
						</div>
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	)
}
