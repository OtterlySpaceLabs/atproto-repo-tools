import Footer from "~/components/common/footer"
import Header from "~/components/common/header"
import CustomHead from "~/components/custom-head"
import ArchiveRepo from "~/components/forms/archive-repo"

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			<CustomHead />
			<main className="flex h-full flex-col">
				<Header />

				<ArchiveRepo />
			</main>

			<Footer />
		</div>
	)
}
